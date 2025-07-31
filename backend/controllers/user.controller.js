import { Notification } from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params; //params for as username is dynamic(differs)

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

/*req.params → for dynamic URL parts: /profile/:username

req.query → for ?key=value pairs: /profile?username=up11

req.body → for POST/PUT body data
*/
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params; // user to follow/unfollow

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Self-follow check
    if (id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      // TODO: return the id of the user as a response
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      // Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();
      // TODO: return the id of the user as a response
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // exclude myself
        },
      },
      { $sample: { size: 10 } }, // randomly select 10 users
    ]);
    // 1,2,3,4,5,6,
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
      //   Checks if each random user is not in the following list of the logged-in user.
      // Only keeps those who I don't follow yet.
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    //Out of valid suggestions give 4 only(after removing usersFollowedByMe )
    suggestedUsers.forEach((user) => (user.password = null));
    // Ensures the password field is not sent back in the API response.(when suggested user comes)
    res.status(200).json(suggestedUsers); //Sends the final array of 4 suggested users.
  } catch (error) {
    console.log("Error in getSuggested Users: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if(!emailRegex.test(email)){
      return res.status(400).json({error:"Invalid email"});
     }

    if (profileImg) {
      if(user.profileImg){ //if previously uploaded image it have to be deleted
        // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
        await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split(".")[0])
      //profileImg.split('/') - split all words with / separately 
      //pop - separates all these words like zmxorcxexpdbh8r0bkjb.png
      //split(".")[0]- then we are alse splitting . => zmxorcxexpdbh8r0bkjb -left id of img
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      if(user.coverImg){
        await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    //password should be null in response
    user.password = null;

    return res.status(200).json(user)
  } catch (error) {
    console.log("Error in getSuggested Users: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//4:05:40