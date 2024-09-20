import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createWorker } from 'tesseract.js';

const Home = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setIsLoading(true);
      try {
        const text = await extractTextFromImage(file);
        setExtractedText(text);
        console.log('Extracted text:', text);
      } catch (error) {
        setError('Error extracting text from image');
        console.error('Text extraction error:', error);
      }
      setIsLoading(false);
    } else {
      setError('Please upload an image file');
    }
  };

  const extractTextFromImage = async (file) => {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text;
  };

  const handleSubmit = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('API key is not set. Please check your environment variables.');
      console.error('API key is not set');
      return;
    }

    setIsLoading(true);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `This is generated by OCR AI from an image taken from the back of the product. Please provide the ingredients in the following JSON format:
    {
      "ingredients": [
        {
          "ingredient": "<ingredient_name>",
          "ingredientDescription": "<description_of_ingredient>",
          "rating": <rating_from_1_to_10>,
          "threat": <true_or_false>
        }
      ]
    }
    
    **Details:**
    - **ingredient**: The name of the ingredient.
    - **ingredientDescription**: A description of the ingredient.
    - **rating**: A number from 1 to 10 indicating how dangerous the ingredient is, with 1 being the least dangerous and 10 being the most.
    - **threat**: Boolean value indicating whether the ingredient is harmful (true) or not (false).
    
    Please ensure the response is a valid JSON string with the exact format shown above. If the response is not in the correct JSON format, return an empty JSON object ({}).
    
    Extracted text: ${extractedText}`;

    try {
      console.log('Sending prompt to Gemini API:', prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini API response:', text);
      const parsedIngredients = JSON.parse(text);
      console.log('Parsed ingredients:', parsedIngredients);
      navigate('/ingredients', { state: { ingredients: parsedIngredients } });
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setError('An error occurred while processing the ingredients');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Analyze Product Ingredients</h1>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-4 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center cursor-pointer"
      >
        {image ? (
          <img src={image} alt="Uploaded" className="max-w-full h-auto mx-auto" />
        ) : (
          <p>Drag and drop an image here, or click to select a file</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
          Select Image
        </label>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {extractedText && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Extracted Text:</h2>
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded"
          />
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!extractedText || isLoading}
        className="w-full bg-green-500 text-white py-2 rounded disabled:bg-gray-300"
      >
        {isLoading ? 'Processing...' : 'Analyze Ingredients'}
      </button>
    </div>
  );
};

export default Home;
