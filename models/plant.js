import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  common_name: { type: String, required: true },
  id: { type: String, required: false },
  cycle: { type: String, required: false },
  watering: {type: String, required:false},
  sunlight: {type: String, required: false}
});

export default mongoose.model('Plant', plantSchema);
