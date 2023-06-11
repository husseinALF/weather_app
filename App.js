import { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";

export default function App() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cityName = city || "stockholm";
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=api_key&q=${cityName}&days=10&aqi=no&alerts=no`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  const handleSearch = () => {
    fetchData();
  };

  const height = Dimensions.get("window").height;
  return (
    <SafeAreaView className="mt-10 " style={{ height: height }}>
      <StatusBar backgroundColor="#00c6fb" />
      <LinearGradient
        colors={["#00c6fb", "#005bea"]}
        style={{ height: height }}
      >
        {data ? (
          <>
            <View className="flex-1 mt-3">
              <View className=" items-start justify-start mx-12 border-2 border-blue-700 rounded-xl">
                <TextInput
                  className="rounded-xl  p-2"
                  placeholder="Search for location"
                  value={city}
                  onChangeText={setCity}
                  onSubmitEditing={handleSearch}
                />
              </View>
              <View className="flex-1 justify-start items-center mt-6 space-y-3">
                <Text className="text-white text-2xl font-semibold">
                  {data.location.name}
                </Text>
                <Text className="text-white text-4xl font-semibold">
                  {data.current.temp_c} °C
                </Text>
                <Text>{data.current.condition.text}</Text>
                <Image
                  source={{ uri: `https://${data.current.condition.icon}` }}
                  className="w-40 h-40"
                />
                <View className="flex-row space-x-7 ">
                  <Text className="text-white font-bold">
                    Wind {data.current.wind_kph} km/h
                  </Text>
                  <Text className="text-white font-bold">
                    Feels like {data.current.feelslike_c} °C
                  </Text>
                </View>
                <View className="flex-row space-x-7  px-3">
                  <View>
                    <Text className="mb-4 text-white ">
                      {data.forecast.forecastday[0].astro.sunrise}
                    </Text>
                    <Icon name="sunrise" size={40} color={"#FDDA0D"} />
                  </View>
                  <View>
                    <Text className="mb-4 text-white ">
                      {data.forecast.forecastday[0].astro.sunset}
                    </Text>
                    <Icon name="sunset" size={40} color={"#FDDA0D"} />
                  </View>
                </View>
                <SafeAreaView className=" mx-3 border-2 border-black  rounded-lg">
                  <ScrollView>
                    <FlatList
                      data={data.forecast.forecastday[0].hour}
                      horizontal
                      keyExtractor={(item) => item.time}
                      renderItem={({ item }) => {
                        const hourIcon = item.condition.icon;
                        const hour = item.time.split(" ")[1];

                        return (
                          <TouchableOpacity className=" border-black border-r-2 px-1 py-1 p-2 border-b-2 pb-5">
                            <Text className="text-white">{hour}</Text>
                            <Text className="text-white">{item.temp_c} °C</Text>
                            <Image
                              source={{
                                uri: `https://${hourIcon}`,
                              }}
                              className="w-16 h-16"
                            />
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </ScrollView>
                </SafeAreaView>
              </View>
            </View>
            <SafeAreaView className=" mx-3  border-blue-900  rounded-lg">
              <ScrollView>
                <FlatList
                  data={data.forecast.forecastday}
                  horizontal
                  keyExtractor={(item) => item.date}
                  renderItem={({ item }) => {
                    const date = item.date.substring(5).replace("-", "/");
                    return (
                      <TouchableOpacity className=" border-r-2 border-blue-800 px-1 py-1">
                        <Text className="text-base font-bold text-slate-200">
                          {date}
                        </Text>
                        <Image
                          source={{
                            uri: `https://${item.day.condition.icon}`,
                          }}
                          className="w-16 h-16"
                        />
                        <Text className="text-sm mb-2 text-slate-200">
                          Max Temp: {item.day.maxtemp_c}°C
                        </Text>
                        <Text className="text-sm mb-2 text-slate-200">
                          Min Temp: {item.day.mintemp_c}°C
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </ScrollView>
            </SafeAreaView>
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text>Loading weather data...</Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}
