import Plant from '../models/plant.js';


const createPlant = async (req, res, next) => {
  try {
    const { name, waterLast, position } = req.body;
    const newPlant = await Plant.create({
      name,
      waterLast,
      position
    });
    // Associate the newly created plant with the user
    req.currentUser.plantsOwned.push(newPlant._id);
    await req.currentUser.save();

    return res.status(201).json(newPlant);
  } catch (error) {
    next(error);
  }
};

// Get all plants owned by the user
const getAllPlants = async (req, res, next) => {
  try {
    // Populate the plantsOwned field to get the complete plant data
    const plants = await Plant.find({
      _id: { $in: req.currentUser.plantsOwned }
    });
    return res.status(200).json(plants);
  } catch (error) {
    next(error);
  }
};

// Get a single plant owned by the user
const getSinglePlant = async (req, res, next) => {
  try {
    const plantId = req.params.id;
    // Check if the plantId exists in the user's plantsOwned array
    if (!req.currentUser.plantsOwned.includes(plantId)) {
      return res.status(404).json({ message: 'Plant not found for the user' });
    }

    // Find the plant and return it
    const plant = await Plant.findById(plantId);
    return res.status(200).json(plant);
  } catch (error) {
    next(error);
  }
};

// Update a plant owned by the user
const updatePlant = async (req, res, next) => {
  try {
    const plantId = req.params.id;
    // Check if the plantId exists in the user's plantsOwned array
    if (!req.currentUser.plantsOwned.includes(plantId)) {
      return res.status(404).json({ message: 'Plant not found for the user' });
    }

    // Find the plant and update its properties
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

// Delete a plant owned by the user
const deletePlant = async (req, res, next) => {
  try {
    const plantId = req.params.id;
    // Check if the plantId exists in the user's plantsOwned array
    if (!req.currentUser.plantsOwned.includes(plantId)) {
      return res.status(404).json({ message: 'Plant not found for the user' });
    }

    // Remove the plant from the user's plantsOwned array
    req.currentUser.plantsOwned = req.currentUser.plantsOwned.filter(
      (id) => id.toString() !== plantId
    );
    await req.currentUser.save();

    // Delete the plant document from the database
    await Plant.findByIdAndDelete(plantId);

    return res.status(200).json({ message: 'Plant deleted successfully🌿' });
  } catch (error) {
    next(error);
  }
};

export { createPlant, getAllPlants, getSinglePlant, updatePlant, deletePlant };