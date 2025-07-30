import { Notification } from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({
          error: "Please provide both current password and new password",
        });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        I;
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
  } catch (error) {}
};
