import React, { useState, useEffect } from 'react';

interface AssigneeProfileImageProps {
    imageId: number; // Adjust this type based on the expected type of imageId
}

const AssigneeProfileImage: React.FC<AssigneeProfileImageProps> = ({ imageId }) => {
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`api/upload/${imageId}`);
                if (response.ok) {
                    console.log("response was ok")
                    const blob = await response.blob();
                    console.log("blob is ok", blob)
                    const url = URL.createObjectURL(blob);
                    setImageUrl(url);
                } else {
                    console.error('Failed to fetch image');
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();

        // Cleanup URL object when the component unmounts
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageId]);

    return (
        <div>
            {imageUrl ? (
                <img className='ml-2 w-[34px] h-[34px] rounded-full' src={imageUrl} alt="From database" />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AssigneeProfileImage;
