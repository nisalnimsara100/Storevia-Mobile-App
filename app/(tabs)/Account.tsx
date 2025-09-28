import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";

type RecentlyViewedItem = {
  id: number;
  image: string;
  price: string;
  name: string;
};

const Account = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(
    []
  );
  const [username, setUsername] = useState("Devinda Thisera");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [followedStoresCount, setFollowedStoresCount] = useState(0);
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const response = [
        {
          id: 1,
          image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBBwMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xAA9EAABAwMCAwYDBgUBCQAAAAABAAIDBAUREiEGMUETIlFhcYEHFJEjMkJSodEVM7Hh8GIWJCU0Q3KCosL/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAERIQL/2gAMAwEAAhEDEQA/APZkUoiIQKUQEREBERAREQQgUogIiFAREQEREBERAREQFKhEEooRBJUIiAiIgIiICKQiCEREBERARSoKAiIgKFJUIBQKEQSpWNX1sFupJKqqeGRMHUgZPgM8z5Lzuq+KU8VU2L+FxsaTkBz9RLehyDg7oPTAqloeHuJ7femCNs0cNaADJSueC9ueWB1C324QFCn9U/qghERAREQEREBERAREQEREBERBIRQiAiIgIiIJREQERCggqFJUICe2fdFI8MoPFvi/O2rv8Ecs8rqJsOjEZ/lvBOogcs5xv5Li/wCL1VLFG2R0k7WgNyxwJcQe6XZ6hdv8WxA2/wAccA0ljQZGj8zhnK8+lbS1EjoahjmSZ+9gjPnlDWz4ahpby+dlPMKKt1ape2mdmZ4yQfbl5c10VHJxLb6ptZWXaalgY4umkmqstA5nu5+mFw8dJNb62nq6GJkvY5+zP4ievqteyrqO0nMpP2r8mNx1Bu+cKj3lvxTtv8GZKIpX17hhscjdDXf6ieg/VcJafiFf6zitk1JPU1pOrtKdri2nI0nuhu+MfmG+cZJXJ091ZI3RVxjHLUBt9FubVUC3u+ZtVQKd7WOa0xkAAHmg7K6fFC+xVZdSW6ijo2gEGVznF4x47Y38l3HBfF9JxRTO0sNPXRAGWmc7O35mnq3/AAr5yu12e+Y6JRIeQdnLW+n7rZ/D+/Osl6pqrtMN+ZayYuPNjsA/Xf3aFB9P5UKnP08VOUFSKnKlBKKEQSiIgIiICIiAiIgIiICIiCUREAqFKgoKSVSXI5WXHCC7rQP3WI55BUCXfyQeG/FmaQccVjg7GlkePTQFy3bwVcfZ1cWoH8QK6b4xtMXFVRLjZ8cZz/4hcRRyagAOaDpqZ8AjkaWdqzRhuHbsI/fksGLhx9dT1E1qe13y+NVO53fdkOPd8dmnYrWPqpo52tigmc4nq0tCoZFcKW4R1UrpaYh28sW5YOvqqqZI308vZ1Ebo5R+FzcH6LNtbe1qBTHdlRHJFjwLmEN/9sLdO4nElNHS3sUdyppWuDJmNDZozjA1A8iOfNae9S2203qkNpmnlp+7NidmHxHVnT5jAByg5xxLgAA4uPIDnnwXcWbhenjs0ldMYK3BOuNz3NYRjGAAOYJzzWkZVUFLUmQ0zm6ppMSZztnI29Csu13f+HTXOUSOMFTGRG8d4eOD4ZRHoNl+IVfTwNNbUPldGGN7Psw9r2gYODsWuPPJOOWx3z6jaLxQ3elZUUFQyUEAuaHZLD4EL5n/ANoWVdurfnC03CpcAx0cekNHLouk4BlqbTxNGwVYqQ98bWSxEhjGHmHagD1xhQfQYKkFWycFSCgu5Uq2CqggqUhQEQSiIgIiICIiAiIgIiIJREQQhRQgpKsvarzlRjKDFe1W8YKynBcjxVxnQ2UupoJI5q3kW6u7GfPz8kHD/GK01FbfKf5Zre9TMc5zjhowXDdcnHRW220/ZsnqzOca542s98ArY3i6S3Sd01Rcn9s88pYjp9AQdh7FaSsgq6eA1EsWqDl28Z1R/X98KjdwUtuqqeWWnrhGYmgu17vf6N8c46435LWXGCqt/emYXNDRqaM90dPQefJc9PXFrwWO0uHUdPZZwvVyu0sTZakSSbRtExA0+er1555oNdVaKuZojAaXEAZOPVdBceErlTOoKZ00crZQWwOkA0teNzETuOhI6FYAoDHVz0lU1sNVAeTOXkR5K9W1NfcaZtPHM/FOB9mH4EZaRgj67e6g17JqOCsD7lROniaSyWBspjLTjGQdzkY659Vl0loprgZH8OVxbOxhe6lqSGPxk7A5w7YA+4WDWVMlXN83MA6VxAmIGznePuFYfSxvIcMN8fNBtI4ohUMlDWteACSGNAPqMYXX0uiGmik0iMhwdIdGjc755DouUa4OkB3x4Lsqi+sr7ZDbvlnd4RRgucCGaSBqHmQqPZbZUCqttJOGuZ2kLX6TuRkdVltKttDWsY1oAAaNvJVAqC8CqwVaad1cCCsKoKkKoICIiAiIgIiICKVCAiIglQpVJQMqFGVS5yCXFWy7Hp19FS5y0fGFZJScM3KeJxa9sBw4HcZ2z+qDRcVcaxBs1tsrfmZjs+aOZrGjxDTgknpkDHPqvJbxRGol7OWnrad7jj7Nwlbn0AyrLbu+gtXa0oLKuqmcHzA76BsAPDZdpZLPV1FjLqWUVFyncHiWoqCxsTeuFLcHn9to4qG4Rx3aolFvkBHbw76PAkeHotpdIbtwfUsraKeKvtNUB9o3vw1DPB45A+a2N/4eu1lpf+LW4mkc7Z0D9bWu/NG/mD4tPPO2VxrbxVQUFRQRSF9FIcmJ33f+5o6Ky72KovMdDUk11oifFA7+bTuOexJ/+fBapu3XHusqgq3UU4lYBIwjS+N33Xt6gqivjijqXGmJNO/vxauYaeh8xy9lUZVvpayvkkko2l0kMZkfl2MgevP0V+ySSG609U5j3RMeHSBmNTmfibvtuDjB8T4q1Y4XvqAC58bHgtL2nB3XWPpIbewOawNYxmTjrjbKg5y+RTR1lS6ftD2uHNMpJccnYEnrjHl5LFgJIblbjjK4trq6nhie3sooY8loz3tLc58TtjHktfLRSUXYEkujmjEjHYxlp5fUKjJh+/6roLa0SVdDC7DRJMwE+A1BaCH74XRWmNlRcrdTE47SZjXEeGUH0A7bboAN1AUkbANxgclWxhURLArzUaxVhqKAKUARAREQEREBERAUoEQQilQglUlSoQUOVp52V1wVp4QY734WsvVILnaqyhJ/5iF0Y9SNv1wtnIzUsVzS07BB8yyU87rJK5zQHUFV2crCe83Vkb+4wu84Jvxjgp3h2dI0uCp+ItnbYeIJLy2Ay2m65jrI27Bkh5n3O/rnxXF0sktgubqeR4kge0OD2OyHNPJw/wA6JWfctnHulXSPNDJdeH42SMLf9/tLv5VUzqWD8Eg6EYB6+K8q454eprW6OvtQ12qvZ21O7G8fi0+h/wA5rsOEeJPlJo/tMxncEHYq98Q30rOGpomRNFO+tZLBvsRJ/MaB5bn3XLMp4tvHgzgS8tAOM7YW4tNrNZRVDpMh0AEjG/mbkB305+xV3+GCkhqpOclM9sjR4s/zP0W9trWNrJm/9N0MjXH/AElhyurTApqUOIiYNGSGjHTK7638PTXiq7zS2kp4yHu/O88mj+pWDwHw3NdKmKtqWFlBE7UHHbtXDljy816zH2cMbY4Wta1vJoGyqWvAeIuArpbqp8lK11VCSXbDvf3WgIMeY54JGzDmX7Y8l9OhgkJ1NBHmFhXPhazXiPTX0THno9vdcPcISvnaB3fG/Nek/Dzhyqr7jSXSaPs6WmdlpcN5HYI/RdRS/CvhyGq7bTVSNByI3zEj0Xc0tPFTxsigjayNgw1rRgAKKqii6lZDWgBQMqoIAwpwoRBKhEQEREBERAREQSEREBQpRBCIiCkhUkK4owgsOarMkYPNuVmEKhzUGgvVppbpb56GtiEtPM3S9h5+o8x0XhvEPDM/Dr/kbsZJ7QXn5WtjaC6nJPNw6+fpt4L6KkjWtuNshuFPJBUxCSJ4w5rhlB82sludjeJIiJ6YuwHsGqJ3v4+4W9dxk+tt7aKKi7Sdx0tD92DPlz+hW9vHw8vljnkn4ZqxLSyOJdST7t+h2PTz81gW208Tiqc6KyQU0r9nSdmMN2xtvtyylhMjCuFDLFVVdM8Av+Te141Zy7DcfqV0XCPCElafnLlmOicNLIiMOnbjG/g3+uV0PDPCvyrHVF3YKiqkwXB/eA/f+y6nsnv6FGbRmljGxRMDGMADQ0YAHRXYoy4q5BSO6hZkcOlUURRYWQxmFW1mFWG4UWIAVbQowpARVQUhECCUREBERAREQEREBERAUhQgQSiIghERAREQCoKkqEFJaFBYDzCrUILTomHbSFQImD8I/ZXioQWjEz8oUCJo5BXsJhBQGgKoBThSAgKUwpQMIilAREQSihSgIiICIiAiIgIiICBEQSiIghERAREQEUIgKMIiBgJgKEQQeakckRBKIiCFUiICIiAiIgKURAREQEREBERAREQf/9k=",
          price: "Rs. 389",
          name: "Camera",
        },
        {
          id: 2,
          image: "data:image/jpeg;base64,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",
          price: "Rs. 599",
          name: "Headset",
        },
        {
          id: 3,
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZdXRDemvzWQsHoIGmE3qG7vqAhUn6vnn0YN37n2-2_St9QGxhC9Icg785HJfkKGx-VI&usqp=CAU",
          price: "Rs. 650",
          name: "Cosmetics",
        },
        
      ];
      setRecentlyViewed(response);
    };

    fetchRecentlyViewed();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = {
        username: "Devinda Thisera",
        wishlistCount: 12,
        followedStoresCount: 5,
      };
      setUsername(userProfile.username);
      setWishlistCount(userProfile.wishlistCount);
      setFollowedStoresCount(userProfile.followedStoresCount);
    };

    fetchUserProfile();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
            style={styles.profilePic}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.username}>{username}</Text>
            <View style={styles.profileStats}>
              <Text style={styles.profileStat}>{wishlistCount} Wishlist</Text>
              <Text style={styles.profileStat}>{followedStoresCount} Followed Stores</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>My Orders</Text>
        <View style={styles.orderTabs}>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="card" size={24} color="#FF8C00" />
            <Text style={styles.tabText}>To Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="paper-plane" size={24} color="#FF8C00" />
            <Text style={styles.tabText}>To Ship</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="cloud-download" size={24} color="#FF8C00" />
            <Text style={styles.tabText}>To Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Ionicons name="checkmark-circle" size={24} color="#FF8C00" />
            <Text style={styles.tabText}>To Review</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentlyViewedSection}>
        <Text style={styles.sectionTitle}>Recently Viewed</Text>
        <View style={styles.recentlyViewedItems}>
          {recentlyViewed.map((item) => (
            <View key={item.id} style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="chatbubbles" size={24} color="#FF8C00" />
          <Text style={styles.footerText}>My Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="cart" size={24} color="#FF8C00" />
          <Text style={styles.footerText}>Buy Any4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="star" size={24} color="#FF8C00" />
          <Text style={styles.footerText}>My Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="call" size={24} color="#FF8C00" />
          <Text style={styles.footerText}>Contact Customer Care</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileDetails: {
    flexDirection: "column",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  profileStat: {
    fontSize: 12,
    color: "#888",
    marginRight: 10,
  },
  followedStores: {
    fontSize: 12,
    color: "#888",
  },
  ordersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tab: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFAF0",
    borderRadius: 10,
    width: 70,
    height: 100,
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
  },
  recentlyViewedSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recentlyViewedItems: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 12,
    color: "#e80404ff",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexWrap: "wrap",
  },
  footerButton: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 10,
    width: "22%",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
    flexWrap: "wrap",
  },
});

export default Account;
