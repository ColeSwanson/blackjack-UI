import React from "react";

const Loading = () => {
return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh", 
            backgroundColor: "#f0f0f0" 
        }}>
            <div style={{ 
                textAlign: "center" 
            }}>
                <div 
                    style={{ 
                        width: "50px", 
                        height: "50px", 
                        border: "5px solid #ccc", 
                        borderTop: "5px solid #007bff", 
                        borderRadius: "50%", 
                        animation: "spin 1s linear infinite" 
                    }}
                ></div>
                <p style={{ 
                    marginTop: "10px", 
                    fontSize: "18px", 
                    color: "#555" 
                }}>Loading...</p>
            </div>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default Loading;