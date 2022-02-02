import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import ReloadIcon from './components/ReloadIcon';
import WeatherDetails from './components/WeatherDetails';
import { colors } from './utils/index';
import { WEATHER_API_KEY } from '@env';

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?';

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unitSystem, setUnitSystem] = useState('metric');
  useEffect(() => {
    load()
  }, [unitSystem])
  async function load() {
    setCurrentWeather(null)
    setErrorMessage(null)
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status != 'granted') {
        setErrorMessage('Permission to access location was denied');
        return
      }
      const location = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}&lang=pt_br`;

      const result = await axios
        .get(weatherUrl)
        .then(res => { setCurrentWeather(res.data); })
        .catch(err => {
          setErrorMessage(err.message);
          return null;
        });
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitsPicker unitsSystem={unitSystem} setUnitsSystem={setUnitSystem}/>
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather}/>
        </View>
        <WeatherDetails currentWeather={currentWeather} unitSystem={unitSystem} />
      </View>
    );
  } else if(errorMessage) {
    return (
      <View style={styles.container}>
        <ReloadIcon load={load} />
        <Text style={{textAlign: 'center'}}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
  else{
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1
  }
});
