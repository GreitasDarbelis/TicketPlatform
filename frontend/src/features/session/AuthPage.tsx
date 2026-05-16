import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthSession } from "./AuthSessionContext";
import { type UserRole, roleHomePaths} from "../../app/roles";
import {CONFIRMATION_CODE} from "../../constants";
import {
    Box,
    Button,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    Paper,
    Tab,
    Tabs,
    useTheme, Alert,
} from '@mui/material';

type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
}

type AuthLocationState = {
    from?: { pathname?: string };
};

function isAuthRoute(pathname: string): boolean {
    return pathname === '/login' || pathname === '/signup';
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auth-tabpanel-${index}`}
            aria-labelledby={`auth-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AuthPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup } = useAuthSession();

    const [tabValue, setTabValue] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [loginError, setLoginError] = useState<string | null>(null);
    const [signupError, setSignupError] = useState<string | null>(null);

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        confirmationCode: '',
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setLoginError(null);
        setSignupError(null);
    };

    const handleLoginChange = (field: string, value: string) => {
        setLoginData((prev) => ({ ...prev, [field]: value }));
        if (loginError) setLoginError(null);
    };

    const handleSignupChange = (field: string, value: string) => {
        setSignupData((prev) => ({ ...prev, [field]: value }));
        if (signupError) setSignupError(null);
    };

    const redirectAfterAuth = (role: UserRole) => {
        const state = location.state as AuthLocationState | null;
        const fromPath = state?.from?.pathname;
        const roleHomePath = roleHomePaths[role];

        const targetPath =
            fromPath && !isAuthRoute(fromPath)
                ? fromPath
                : roleHomePath;

        navigate(targetPath, { replace: true });
    };

    const handleLoginSubmit = async () => {
        setLoginError(null);

        if (!loginData.email.trim() || !loginData.password.trim()) {
            setLoginError('Please fill in all fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await login(loginData.email, loginData.password);
            redirectAfterAuth(user.role);
        } catch (error) {
            setLoginError(error instanceof Error ? error.message : 'Login failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignupSubmit = async () => {
        setSignupError(null);

        const missingRequired =
            !signupData.username.trim() ||
            !signupData.email.trim() ||
            !signupData.password.trim() ||
            !signupData.confirmPassword.trim() ||
            (requiresConfirmationCode && !signupData.confirmationCode.trim());

        if (missingRequired) {
            setSignupError('Please fill in all fields.');
            return;
        }

        if (signupData.password !== signupData.confirmPassword) {
            setSignupError('Passwords do not match.');
            return;
        }

        if (requiresConfirmationCode && signupData.confirmationCode !== CONFIRMATION_CODE) {
            setSignupError('Incorrect confirmation code.');
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await signup(signupData.username, signupData.email, signupData.password, signupData.role as UserRole);
            redirectAfterAuth(user.role);
        } catch (error) {
            setSignupError(error instanceof Error ? error.message : 'Sign up failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const requiresConfirmationCode =
        signupData.role === 'organizer' || signupData.role === 'staff';

    return (
        <Box sx={{ minHeight: '100vh', p: 4, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.main} 100%)` }}>
            <Paper
                sx={{
                    p: 4,
                    maxWidth: 500,
                    width: '100%',
                    borderRadius: 1,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}
                >
                    Greitas Darbelis
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ textAlign: 'center', fontWeight: 'light', color: 'text.disabled', mb: 3 }}
                >
                    Your Ticket Platform
                </Typography>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                        mb: 3,
                        '& .MuiTabs-indicator': {
                            display: 'none',
                        },
                    }}>
                    <Tab
                        label="Log In"
                        sx={{
                            flex: 1,
                            borderRadius: '12px',
                            mr: 1,
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            },
                        }}
                    />
                    <Tab
                        label="Sign Up"
                        sx={{
                            flex: 1,
                            borderRadius: '12px',
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            },
                        }}
                    />
                </Tabs>

                {/* Login Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='subtitle2' sx={{pl: 1}}>
                            Email
                        </Typography>
                        <TextField
                            type="email"
                            fullWidth
                            value={loginData.email}
                            onChange={(e) => handleLoginChange('email', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />

                        <Typography variant='subtitle2' sx={{pl: 1, mt: 2}}>
                            Password
                        </Typography>
                        <TextField
                            type="password"
                            fullWidth
                            value={loginData.password}
                            onChange={(e) => handleLoginChange('password', e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                },
                            }}
                        />

                        {loginError && <Alert severity="error" sx={{ mt: 2 }}>{loginError}</Alert>}

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: 'secondary.main',
                                color: 'text.secondary',
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                mt: 2,
                            }}
                            onClick={handleLoginSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Log In'}
                        </Button>
                    </Box>
                </TabPanel>

                {/* Sign Up Tab */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='subtitle2' sx={{pl: 1}}>
                            Username
                        </Typography>
                        <TextField
                            fullWidth
                            value={signupData.username}
                            onChange={(e) => handleSignupChange('username', e.target.value)}
                        />

                        <Typography variant='subtitle2' sx={{pl: 1, mt: 2}}>
                            Email
                        </Typography>
                        <TextField
                            type="email"
                            fullWidth
                            value={signupData.email}
                            onChange={(e) => handleSignupChange('email', e.target.value)}
                        />

                        <Typography variant='subtitle2' sx={{pl: 1, mt: 2}}>
                            Password
                        </Typography>
                        <TextField
                            type="password"
                            fullWidth
                            value={signupData.password}
                            onChange={(e) => handleSignupChange('password', e.target.value)}
                        />

                        <Typography variant='subtitle2' sx={{pl: 1, mt: 2}}>
                            Confirm Password
                        </Typography>
                        <TextField
                            type="password"
                            fullWidth
                            value={signupData.confirmPassword}
                            onChange={(e) =>
                                handleSignupChange('confirmPassword', e.target.value)
                            }
                        />
                        <FormControl fullWidth>
                            <Typography variant='subtitle2' sx={{pl: 1, mt: 2}}>
                                Role
                            </Typography>
                            <Select
                                value={signupData.role}
                                onChange={(e) => handleSignupChange('role', e.target.value)}
                            >
                                <MenuItem value="customer">Customer</MenuItem>
                                <MenuItem value="organizer">Organizer</MenuItem>
                                <MenuItem value="staff">Staff</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Conditional Confirmation Code Field */}
                        {requiresConfirmationCode && (
                            <>
                                <Typography variant='subtitle2' sx={{pl: 1, mt: 2}}>
                                    Confirmation code
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={signupData.confirmationCode}
                                    onChange={(e) =>
                                        handleSignupChange('confirmationCode', e.target.value)
                                    }
                                />
                            </>
                        )}

                        {signupError && <Alert severity="error" sx={{ mt: 2 }}>{signupError}</Alert>}

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: 'secondary.main',
                                color: 'text.secondary',
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                mt: 2,
                            }}
                            onClick={handleSignupSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating account...' : 'Sign Up'}
                        </Button>
                    </Box>
                </TabPanel>
            </Paper>
        </Box>
    );
}
