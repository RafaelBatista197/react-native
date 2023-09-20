import { React, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PalettePreview from '../components/PalettePreview';

const Home = ({ navigation, route }) => {
  const newColorPalette = route.params
    ? route.params.newColorPalette
    : undefined;
  const [colorsPalette, setColorsPalette] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFetchColorPalette = useCallback(async () => {
    const response = await fetch(
      'https://color-palette-api.kadikraman.now.sh/palettes',
    );
    if (response.ok) {
      const palettes = await response.json();
      setColorsPalette(palettes);
    }
  }, []);

  useEffect(() => {
    handleFetchColorPalette();
  }, []);

  useEffect(() => {
    if (newColorPalette) {
      setColorsPalette((colorsPalette) => [newColorPalette, ...colorsPalette]);
    }
  }, [newColorPalette]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await handleFetchColorPalette();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View>
      <FlatList
        style={styles.list}
        data={colorsPalette}
        keyExtractor={(item) => item.paletteName}
        renderItem={({ item }) => (
          <PalettePreview
            palette={item}
            handlePress={() => navigation.navigate('ColorPalette', item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('ColorPaletteModal')}
          >
            <Text style={styles.buttonText}>Add a color scheme</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'teal',
    marginBottom: 10,
  },
});

export default Home;
