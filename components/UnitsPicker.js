import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-community/picker'


export default function UnitsPicker({unitsSystem, setUnitsSystem}) {
  return (
    <View style={styles.unitSystem}>
      <Picker 
      selectedValue={unitsSystem} 
      onValueChange={(item) => setUnitsSystem(item)} 
      mode="dropdown" 
      itemStyle={{fontSize: 12}}>
        <Picker.Item label="ºC" value="metric" />
        <Picker.Item label="ºF" value="imperial" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
    unitSystem: {
        position: 'absolute',
        ...Platform.select({
            ios:{
                top: -20
            },
            android: {
                top: 20
            }
        }),
        left: -100,
        height: 50,
        width: 100
    }
})
