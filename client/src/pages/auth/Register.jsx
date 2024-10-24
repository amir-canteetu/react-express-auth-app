import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

// Material UI imports
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid2"; 
import Stack from "@mui/material/Stack";

// Icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Third-party libraries
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import Copyright from "../../components/global-components/copyright";
import { axiosInstance } from  "../../api/apiService";

export default function Register() {

      const { login } = useAuth();

      const handleClickShowPassword = useCallback(() => {
        setShowPassword((show) => !show);
      }, []);  
      
      const [errors, setErrors]             = useState(null);
      const [showPassword, setShowPassword] = useState(false);
      const navigate                        = useNavigate();
      const [isLoading, setisLoading]       = useState(false);

      const formik = useFormik({
        initialValues: {
          first_name: "",
          last_name: "",
          password: "",
          email: "",          
          role: "",
        },
        validationSchema: Yup.object({
          username:     Yup.string().required("Required"),
          password:     Yup.string().required("Required"),
          email:        Yup.string().email("Invalid email address").required("Required"),          
          role:         Yup.string().required("Please specify your role."),
        }),
        onSubmit: async (values) => {
          setisLoading(true);
          try {
            const res                       = await axiosInstance.post("/auth/register", values );
            const { id, username, role  }   = res.data.user;
            login( { id, username, role } );    
            navigate('/app');
          } catch (err) {
            const errorMessages = err?.response?.data?.errors || [{ msg: "Something went wrong. Please try again." }];
            setErrors(errorMessages);     
          }finally {
            setisLoading(false);
          }
        },
      });

      const roleTypes = useMemo(() => [
          { value: 'user', label: 'User' },
          { value: 'admin', label: 'Admin' },
      ], []);

      return (
        <Container component="main" maxWidth="xs" disableGutters>
                <Box component="section" sx={{ p: 2 }}>
                  <Stack spacing={5} alignItems="center" justifyContent="center">
                        <Avatar sx={{ m: 5, bgcolor: "primary.main" }}>
                              <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                          Sign up
                        </Typography>      
                  </Stack>   
                </Box>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
                <Stack spacing={3} alignItems="center" justifyContent="center">
                      <TextField
                        id="username"
                        autoComplete="username"
                        name="username"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && formik.errors.username}
                        helperText={
                          formik.touched.username && formik.errors.username
                        } />
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email}/>


                      <TextField  
                        required
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}    
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end">
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                            ),
                          },
                        }}/>   

                    
                    <TextField
                      id="role"
                      required
                      fullWidth
                      select
                      defaultValue = ""
                      name="role"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.role && formik.errors.role}
                      helperText={formik.touched.role && formik.errors.role}                  
                      label="Please select your role">
                      {roleTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>                                 
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                      </Button>
                      {errors && errors.length > 0 && (
                        <Box component="ul" sx={{ color: 'red', mt: 2, listStyleType: 'none', padding: 0 }}>
                          {errors.map((err, index) => (
                            <li key={index}>{err.msg}</li>
                          ))}
                        </Box>
                      )}
                      <Grid container justifyContent="center">
                        <Grid item>
                          <Link to={`/login`}>                                
                            <Typography variant="subtitle1" align="center" gutterBottom sx={{ display: 'block' }}>
                            Already have an account? Sign in
                            </Typography>     
                          </Link>
                        </Grid>
                      </Grid>                      
                      </Stack>  
                </Box>
              <Copyright sx={{ mt: 4 }} />   
        </Container>  

      );
}
