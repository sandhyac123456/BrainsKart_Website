const User = require("../Model/User")
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");
const path = require("path");

exports.forgotPassword = async (req, res) => {

  const { email } = req.body;
    console.log(" Email received:", email);

  const user = await User.findOne({ email });
  console.log("User found in DB:", user);

  if (!user) {
        console.log("User not found for email:", email);
    return res.status(404).json({ message: "User not found" });
  }


  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `
    <p>Click the link to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link expires in 15 minutes.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    message,
  });
  console.log("Forgot password process successful for user:", user.email);

  res.status(200).json({ message: "Reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });
console.log("Old hashed password:", user.password);

const hashedPassword = await bcrypt.hash(password, 10);
user.password = hashedPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
console.log(" Password reset successful for:", user.email);

  res.status(200).json({ message: "Password reset successful" });
};

// exports.register = async (req, res) => {
//   const { username, email, password, image } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists with this email." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let imageFileName = null;

//     if (image && image.startsWith("data:image/")) {
//       const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
//       if (!matches) return res.status(400).json({ message: "Invalid image format" });

//       const ext = matches[1];
//       const base64Data = matches[2];
//       const buffer = Buffer.from(base64Data, "base64");

//       const fileName = `${Date.now()}-${username}.${ext}`;
//       const filePath = path.join(__dirname, "../uploads", fileName);

//       fs.writeFileSync(filePath, buffer);

//       // imageUrl = `${process.env.SERVER_URL}/uploads/${fileName}`;
//        imageFileName = fileName;
//     }

//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       image: imageFileName,
//     });

//     await user.save();

//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.register = async (req, res) => {
//   const { username, email, password, image } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists with this email." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let imageUrl = null;

//     if (image && image.startsWith("data:image/")) {
//       const uploadResult = await cloudinary.uploader.upload(image, {
//         folder: "brainskart_users", 
//         resource_type: "image"
//       });
//       imageUrl = uploadResult.secure_url; 
//     }

//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       image: imageUrl, 
//     });

//     await user.save();

//     res.status(201).json({ message: "User registered successfully", user });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const cloudinary = require("../config/cloudinary"); 

exports.register = async (req, res) => {
  const { username, email, password, image } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = null;

    if (image && typeof image === "string" && image.startsWith("data:image/")) {
      try {
        const uploadResult = await cloudinary.uploader.upload(image, {
          folder: "brainskart_users",
          resource_type: "image",
        });

        console.log("Cloudinary uploadResult:", uploadResult); 
        imageUrl = uploadResult.secure_url || uploadResult.url || null;
        console.log("imageUrl set to:", imageUrl);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
      }
    } else if (image && typeof image === "string" && image.startsWith("http")) {
      imageUrl = image;
    } else {
      imageUrl = null;
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      image: imageUrl,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password  } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      console.log(" User not found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(" Password does not match");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // console.log(" Login successful for:", user.email);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,  

      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
