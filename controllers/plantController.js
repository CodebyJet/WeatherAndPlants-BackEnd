import Plant from '../models/plant.js';

const createPlant = async (req, res, next) => {
  try {
    const { name, waterLast, position } = req.body;
    const newPlant = await Plant.create({
      name,
      waterLast,
      position
    });

    req.currentUser.plantsOwned.push(newPlant._id);

    await req.currentUser.populate('plantsOwned').execPopulate();

    await req.currentUser.save();

    return res.status(201).json(newPlant);
  } catch (error) {
    next(error);
  }
};

const getAllPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find({
      _id: { $in: req.currentUser.plantsOwned }
    });
    return res.status(200).json(plants);
  } catch (error) {
    next(error);
  }
};

const getSinglePlant = async (req, res, next) => {
  try {
    const plantId = req.params.id;
    ay;
    if (!req.currentUser.plantsOwned.includes(plantId)) {
      return res.status(404).json({ message: 'Plant not found for the user' });
    }

    const plant = await Plant.findById(plantId);
    return res.status(200).json(plant);
  } catch (error) {
    next(error);
  }
};

const updatePlant = async (req, res, next) => {
  try {
    const plantId = req.params.id;

    if (!req.currentUser.plantsOwned.includes(plantId)) {
      return res.status(404).json({ message: 'Plant not found for the user' });
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      plantId,
      { $set: req.body },
      { new: true }
    );

    return res.status(200).json(updatedPlant);
  } catch (error) {
    next(error);
  }
};

const deletePlant = async (req, res, next) => {
  try {
    const plantId = req.params.id;

    if (!req.currentUser.plantsOwned.includes(plantId)) {
      return res.status(404).json({ message: 'Plant not found for the user' });
    }

    req.currentUser.plantsOwned = req.currentUser.plantsOwned.filter(
      (id) => id.toString() !== plantId
    );
    await req.currentUser.save();

    await Plant.findByIdAndDelete(plantId);

    return res.status(200).json({ message: 'Plant deleted successfully🌿' });
  } catch (error) {
    next(error);
  }
};

export default {
  createPlant,
  getAllPlants,
  getSinglePlant,
  updatePlant,
  deletePlant
};
