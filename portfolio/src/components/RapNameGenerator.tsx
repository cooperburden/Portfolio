import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  hairColor: string;
  favoriteFood: string;
  favoriteColor: string;
  favoriteAnimal: string;
}

const RapNameGenerator = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: '',
    hairColor: '',
    favoriteFood: '',
    favoriteColor: '',
    favoriteAnimal: '',
  });
  const [rapName, setRapName] = useState<string>('');
  const [rapperImage, setRapperImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/test');
        if (response.ok) {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        console.error('Backend connection error:', err);
        setBackendStatus('offline');
      }
    };

    checkBackend();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRapName = async () => {
    setLoading(true);
    setError('');
    try {
      // Call the backend API to generate a rap name
      const response = await fetch('http://localhost:3001/generate-rap-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRapName(data.rapName);
    } catch (err) {
      console.error('Error generating rap name:', err);
      
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Could not connect to the server. Please make sure the backend is running.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate rap name');
      }
      
      // Fallback to mock implementation if the API call fails
      try {
        // Generate a more personalized rap name based on the input
        const { firstName, lastName, age, hairColor, favoriteFood, favoriteColor, favoriteAnimal } = formData;
        
        // Prefix options based on age
        let prefix = '';
        const ageNum = parseInt(age);
        if (ageNum < 25) {
          prefix = 'Young';
        } else if (ageNum < 40) {
          prefix = 'MC';
        } else {
          prefix = 'The';
        }
        
        // Middle part based on first name and favorite animal
        const firstInitial = firstName.charAt(0).toUpperCase();
        const animalInitial = favoriteAnimal.charAt(0).toUpperCase();
        const middlePart = `${firstInitial}${animalInitial}`;
        
        // Suffix based on favorite color and food
        let suffix = '';
        if (favoriteColor.toLowerCase().includes('red')) {
          suffix = 'Fire';
        } else if (favoriteColor.toLowerCase().includes('blue')) {
          suffix = 'Ice';
        } else if (favoriteColor.toLowerCase().includes('green')) {
          suffix = 'Nature';
        } else if (favoriteFood.toLowerCase().includes('pizza')) {
          suffix = 'Slice';
        } else if (favoriteFood.toLowerCase().includes('burger')) {
          suffix = 'Grill';
        } else if (favoriteFood.toLowerCase().includes('taco')) {
          suffix = 'Taco';
        } else {
          // Default suffixes if no specific matches
          const suffixes = ['Beast', 'Master', 'King', 'Queen', 'Boss', 'Star', 'Legend', 'Pro', 'Guru', 'Ninja'];
          suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        }
        
        // Special case for hair color
        let specialName = '';
        if (hairColor.toLowerCase().includes('blonde')) {
          specialName = 'Gold';
        } else if (hairColor.toLowerCase().includes('red')) {
          specialName = 'Flame';
        } else if (hairColor.toLowerCase().includes('black')) {
          specialName = 'Shadow';
        } else if (hairColor.toLowerCase().includes('brown')) {
          specialName = 'Earth';
        }
        
        // Combine the parts
        let mockRapName = '';
        if (specialName) {
          // Use special name if available
          mockRapName = `${prefix} ${specialName} ${suffix}`;
        } else {
          // Use standard format
          mockRapName = `${prefix} ${middlePart} ${suffix}`;
        }
        
        setRapName(mockRapName);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateRapperImage = async () => {
    setImageLoading(true);
    setError('');
    try {
      console.log('Sending request to generate rapper image...');
      const response = await fetch('http://localhost:3001/generate-rapper-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL in response');
      }

      setRapperImage(data.imageUrl);
    } catch (err) {
      console.error('Error generating rapper image:', err);
      setError(
        err instanceof Error 
          ? `Error: ${err.message}` 
          : 'Failed to generate rapper image'
      );
      setRapperImage('');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRapName();
  };

  const handleGenerateImage = (e: React.MouseEvent) => {
    e.preventDefault();
    generateRapperImage();
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font styles
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      
      // Add title
      doc.setTextColor(100, 255, 218); // Similar to your theme color #64ffda
      doc.text('Your Rap Persona', 105, 20, { align: 'center' });

      // Add rap name
      doc.setFontSize(32);
      doc.setTextColor(230, 241, 255); // Similar to your theme color #e6f1ff
      doc.text(rapName, 105, 40, { align: 'center' });

      // Add details
      doc.setFontSize(12);
      doc.setTextColor(136, 146, 176); // Similar to your theme color #8892b0
      const details = [
        `Name: ${formData.firstName} ${formData.lastName}`,
        `Age: ${formData.age}`,
        `Hair Color: ${formData.hairColor}`,
        `Favorite Food: ${formData.favoriteFood}`,
        `Favorite Color: ${formData.favoriteColor}`,
        `Favorite Animal: ${formData.favoriteAnimal}`
      ];

      details.forEach((detail, index) => {
        doc.text(detail, 20, 60 + (index * 7));
      });

      // Add a note about the image
      doc.setFontSize(10);
      doc.setTextColor(136, 146, 176);
      doc.text('Note: To save your rapper image, please right-click the image above and select "Save Image As..."', 105, 100, { 
        align: 'center',
        maxWidth: 150
      });

      // Save the PDF
      doc.save('rap-persona.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
    }
  };

  return (
    <div className="project-card">
      <div className="project-image">
        <img src="/images/rap-name-generator.jpg" alt="Rap Name Generator" />
      </div>
      <div className="project-content">
        <h2>Rap Name Generator</h2>
        <p>Generate your unique rap name and image based on your personal characteristics!</p>
        
        {backendStatus === 'offline' && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            Backend server is offline. Using local generation instead.
          </div>
        )}
        
        {!showForm && !rapName && (
          <button 
            className="generate-button"
            onClick={() => setShowForm(true)}
          >
            Try It Now
          </button>
        )}
        
        {showForm && !rapName && (
          <form onSubmit={handleSubmit} className="rap-name-form">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="hairColor"
                value={formData.hairColor}
                onChange={handleInputChange}
                placeholder="Hair Color"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="favoriteFood"
                value={formData.favoriteFood}
                onChange={handleInputChange}
                placeholder="Favorite Food"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="favoriteColor"
                value={formData.favoriteColor}
                onChange={handleInputChange}
                placeholder="Favorite Color"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="favoriteAnimal"
                value={formData.favoriteAnimal}
                onChange={handleInputChange}
                placeholder="Favorite Animal"
                required
              />
            </div>
            <button 
              type="submit" 
              className="generate-button"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Rap Name'}
            </button>
          </form>
        )}

        {error && <div className="error-message">{error}</div>}

        {rapName && (
          <div className="rap-name-result">
            <h3>Your Rap Name:</h3>
            <div className="generated-name">{rapName}</div>
            
            {!rapperImage && !imageLoading && (
              <button 
                className="generate-button image-button"
                onClick={handleGenerateImage}
                disabled={imageLoading}
              >
                Generate Rapper Image
              </button>
            )}

            {imageLoading && (
              <div className="loading-message">Generating your rapper image...</div>
            )}
            
            {rapperImage && (
              <>
                <div className="rapper-image">
                  <img src={rapperImage} alt="Generated Rapper" />
                </div>
                <button 
                  className="generate-button download-button"
                  onClick={handleDownloadPDF}
                >
                  Download as PDF
                </button>
              </>
            )}

            <button 
              className="generate-button try-again"
              onClick={() => {
                setRapName('');
                setRapperImage('');
                setShowForm(false);
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RapNameGenerator; 