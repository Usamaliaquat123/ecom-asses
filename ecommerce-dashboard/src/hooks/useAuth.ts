import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { RootState } from '@/lib/store';
import { loginStart, loginSuccess, loginFailure, logout, setUser } from '@/lib/features/auth/authSlice';
import { LOGIN, REGISTER } from '@/graphql/mutations';
import { GET_ME } from '@/graphql/queries';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);

  // Check if user is authenticated on app load
  const { data: meData } = useQuery(GET_ME, {
    skip: !token,
    onCompleted: (data) => {
      if (data.me) {
        dispatch(setUser(data.me));
      }
    },
    onError: () => {
      dispatch(logout());
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      // Token exists but not in state, trigger me query
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login) {
        dispatch(loginSuccess({
          user: data.login.user,
          token: data.login.token,
        }));
        return { success: true };
      }
    } catch (err: any) {
      dispatch(loginFailure(err.message || 'Login failed'));
      return { success: false, error: err.message };
    }
  };

  const register = async (input: any) => {
    try {
      dispatch(loginStart());
      const { data } = await registerMutation({
        variables: { input },
      });

      if (data?.register) {
        dispatch(loginSuccess({
          user: data.register.user,
          token: data.register.token,
        }));
        return { success: true };
      }
    } catch (err: any) {
      dispatch(loginFailure(err.message || 'Registration failed'));
      return { success: false, error: err.message };
    }
  };

  const signOut = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: signOut,
  };
};
