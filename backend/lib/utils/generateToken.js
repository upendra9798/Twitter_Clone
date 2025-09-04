import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in environment");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Production cookie settings
  const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,                    // Prevent XSS
    path: "/",                         // Make cookie available for all paths
    secure: true,                      // Required for cross-origin in production
    sameSite: "none",                  // Required for cross-origin in production
    domain: ".onrender.com"            // Production domain
  };

  /* Development settings (for reference)
  const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,                    // Prevent XSS
    path: "/",                         // Make cookie available for all paths
    secure: false,                     // Allow HTTP for localhost
    sameSite: "lax"                    // Default for localhost
  };
  */

  // Debug logs
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Cookie options:', cookieOptions);

  // Set cookie with configured options
  res.cookie("jwt", token, cookieOptions);
  
  // Log cookie being set (for debugging)
  console.log('Setting cookie with options:', { ...cookieOptions, token: token.substring(0, 10) + '...' });
  
  return token; // Return token for debugging
};


// Now change everything to production while commenting ot development code separately