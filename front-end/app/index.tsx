import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Surface, Text } from 'react-native-paper';
import { useUser } from '../contexts/UserContext';
import { auth } from '../services/auth';

const { width } = Dimensions.get('window');

const colors = {
  background: '#00000000',
  surface: '#FFFFFF',
  primary: '#000000',
  accent: '#FF6B4A',
  textPrimary: '#111111',
  textSecondary: '#666666',
};

export default function LoginScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          router.replace('/home');
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsAuthChecked(true);
      }
    };

    if (!isAuthChecked) {
      checkUser();
    }
  }, [router, setUser, isAuthChecked]); 

  const loginIntra = async () => {
    try {
      setIsLoading(true);
      await auth.login42();
      // After successful login, recheck auth status
      setIsAuthChecked(false);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  // Only show loading indicator during initial auth check
  if (!isAuthChecked && isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  // If user is already logged in, don't show login screen
  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/lamrabti.jpg')}
        style={styles.gridBackground}
      >
        <Surface style={styles.contentContainer} elevation={0}>
          <View style={styles.mainContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome back</Text>
              <Text style={styles.welcomeSubtitle}>Please login to continue.</Text>
            </View>
            <Button
              onPress={loginIntra}
              mode="contained"
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              textColor="black"
              disabled={isLoading}
            >
              <View style={styles.buttonContent}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <>
                    <Image
                      source={require('../assets/images/42.png')}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Sign in with Intra</Text>
                  </>
                )}
              </View>
            </Button>
          </View>
        </Surface>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gridBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: width * 0.9,
    backgroundColor: '#00000000',
    maxWidth: 400,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 0,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  mainContent: {
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 84,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    height: 48,
    width: '100%',
  },
  loginButtonLabel: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 32,
    height: 32,
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Loading state styles
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  disabledButton: {
    opacity: 0.7,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  }
});