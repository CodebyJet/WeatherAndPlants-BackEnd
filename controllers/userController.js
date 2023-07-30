import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { SECRET } from '../config/environment.js';

async function registerUser(req, res, next) {
  try {
    if (req.body.password !== req.body.passwordConfirmation) {
      return res.status(422).json({ message: 'Passwords do not match' });
    }

    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

async function loginUser(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'Unauthorized, user not found' });
    }

    const isValidPassword = user.validatePassword(req.body.password);

    if (!isValidPassword) {
      return res
        .status(403)
        .json({ message: 'Unauthorized, invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      SECRET,
      { expiresIn: '6h' }
    );

    return res.status(202).send({ token, message: 'Login Successful!' });
  } catch (e) {
    next(e);
  }
}

const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.find().populate('entries');
    return res.status(200).json(users);
  } catch (e) {
    next(e);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'entries',
      populate: {
        path: 'country'
      }
    });
    return user
      ? res.status(200).json(user)
      : res.status(404).json({ message: `No user with id ${req.params.id}` });
  } catch (e) {
    next(e);
  }
};

async function searchUser(req, res, next) {
  try {
    const { search } = req.query;
    const user = await User.find({
      username: { $regex: search, $options: 'i' }
    });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

const deleteSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.currentUser.isAdmin) {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Successfully deleted user' });
    }

    return res.status(301).json({ message: 'Unauthorized' });
  } catch (e) {
    next(e);
  }
};

const updateSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    // console.log('req id is ', req.currentUser._id, 'user._id is ', user._id);

    if (!user) {
      return res.status(404).send({ message: 'No user found' });
    }

    if (user._id.equals(req.currentUser._id)) {
      user.set(req.body);
      const updatedUser = await user.save();
      return res.status(200).json(updatedUser);
    }

    return res
      .status(301)
      .json({ message: 'Unauthorized from updated single user' });
  } catch (e) {
    next(e);
  }
};

export default {
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  searchUser,
  deleteSingleUser,
  updateSingleUser
};
