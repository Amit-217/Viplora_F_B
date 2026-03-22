import api from './src/utils/api'; // Wait, I don't have api client here, I will use axios directly or fetch.
import axios from 'axios';

async function check() {
  try {
    const res = await axios.post('http://localhost:5000/api/volunteer/apply', {
      name: 'Test Testov',
      email: 'testtest1223@email.com',
      phone: '1234567890',
      occupation: 'Developer',
      skills: 'Coding',
      location: 'City1',
      availability: 'flexible',
      reason: 'This is a test motivation text.'
    });
    console.log(res.data);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
  }
}

check();
