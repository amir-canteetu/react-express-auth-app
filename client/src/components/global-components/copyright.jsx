import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function  Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link to={`/`}>React-Auth-Context-Demo {new Date().getFullYear()}</Link>
      </Typography>
    );
  }