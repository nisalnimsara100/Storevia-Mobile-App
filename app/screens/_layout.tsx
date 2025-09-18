import { Tabs } from "expo-router";
const Layout = () => {
    return(
        <Tabs>
        <Tabs.Screen name="home_screen" options={{tabBarLabel:'Home', headerShown : false}}/>
        <Tabs.Screen name="profile_screen" options={{tabBarLabel: 'Profile',headerShown : false}}/>  
        </Tabs>
    );
};
export default Layout;