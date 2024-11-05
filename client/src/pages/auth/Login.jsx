import { useState, useCallback } from "react";
import { useAuth } from '../../context/AuthContext';
import { Link } from "react-router-dom";

// Material UI imports
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
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

export default function Login() {

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
          password: "",
          email: "",          
        },
        validationSchema: Yup.object({
          password:       Yup.string().required("Required"),
          email:          Yup.string().email("Invalid email address").required("Required"),          
        }),
        onSubmit: async (values) => {
          setisLoading(true);
          try {
            const res = await axiosInstance.post( "/auth/login", values, { withCredentials: true });
            const { accessToken, user  }  = res.data;
            const userData                = { ...user, accessToken };
            login(userData);    
            navigate('/app');
          } catch (err) {
            const errorMessages = err?.response?.data?.errors || [{ msg: "Something went wrong. Please try again." }];
            setErrors(errorMessages);     
          }finally {
            setisLoading(false);
          }
        },
      });
 

      return (
        <Container component="main" maxWidth="xs" disableGutters>
                <Box component="section" sx={{ p: 2 }}>
                  <Stack spacing={5} alignItems="center" justifyContent="center">
                        <Avatar sx={{ m: 5, bgcolor: "primary.main" }}>
                              <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                          Sign in
                        </Typography>      
                  </Stack>   
                </Box>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
                <Stack spacing={3} alignItems="center" justifyContent="center">
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
                        error={formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email}
                      />

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
                        error={formik.touched.password && !!formik.errors.password}
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
                        }}
                      />   
                              
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </Button>
                      {errors && errors.length > 0 && (
                        <Box component="ul" sx={{ color: 'red', mt: 2, listStyleType: 'none', padding: 0 }}>
                          {errors.map((err, index) => (
                            <li key={index}>{err.msg}</li>
                          ))}
                        </Box>
                      )}
                      
                      <Grid container justifyContent="center" spacing={2}>
                        <Grid justifyContent="center" size={12}>
                          <Link to={`/register`}>                                
                            <Typography variant="subtitle1" align="center" gutterBottom sx={{ display: 'block' }}>
                                Don't have an account? Register
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
