import TextField from '@mui/material/TextField';
import './Home.css';
import { Typography } from '@mui/material';

export const Home = () => {
  return (
    <div className="home">
      <Typography variant="h4" className="home-title">
        I am cardinal Francis Xavier Nguyen Van Thuan. Ask me any question!
      </Typography>
      <TextField
        label="Ask a question"
        placeholder="Ask me a question"
        multiline
        maxRows={4}
        variant="standard"
        className="home-text-field"
      />
    </div>
  );
};
