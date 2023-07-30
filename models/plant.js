import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: false },
  waterLast: {type: String, required:false},
  position: {type: String, required: false}
});

export default mongoose.model('Plant', plantSchema);
