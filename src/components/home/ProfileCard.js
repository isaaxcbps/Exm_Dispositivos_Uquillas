import React from "react";
import { View, Text, StyleSheet, Image, Linking, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const socialMediaIcons = {
  twitter: <Icon name={'twitter'} size={30} color={'black'} />,
  facebook: <Icon name={'facebook'} size={30} color={'black'} />,
  instagram: <Icon name={'instagram'} size={30} color={'black'} />,
  linkedin: <Icon name={'linkedin'} size={30} color={'black'} />,
  wps: <Icon name={'whatsapp'} size={30} color={'black'} />,
  kwai: <Icon name={'link'} size={30} color={'black'} />,
};

const ProfileCard = () => {
  const user = {
    avatar: "https://i.postimg.cc/NFTgn613/ezgif-1a6a312e454100.gif",
    coverPhoto: "https://scontent.fuio5-1.fna.fbcdn.net/v/t39.30808-6/447721014_1228366768479197_5200551949094648361_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=JbzexaC8n9EQ7kNvgH2LLyR&_nc_oc=AdjFf2SFDaEtR1dWJsBXCX88n5yavZaSFr9g489utplFCrc3pYo_D5xBegLxbB_DbHk&_nc_zt=23&_nc_ht=scontent.fuio5-1.fna&_nc_gid=AUVSBJa4M07RpRpz2sgvYuH&oh=00_AYA1rJkykNAMi8uCFoJbvE_i9kqZFDqkuuAgwdGj-SdRdg&oe=67BD645C",
    name: "NORMAN ISAAC UQUILLAS VERDEZOTO",
    socialMedia: {
      twitter: 'https://twitter.com/',
      facebook: 'https://facebook.com/',
      instagram: 'https://instagram.com/',
      linkedin: 'https://linkedin.com/',
      wps: 'https://api.whatsapp.com/send?phone=593999898401&text=hola%20como%20estas',
      kwai: 'https://kwai.com/',
    },
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.coverPhoto }} style={styles.coverPhoto} />
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>
          {user.name}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {Object.keys(user.socialMedia).map((socialMedia, index) => (
          <TouchableWithoutFeedback key={index} onPress={() => Linking.openURL(user.socialMedia[socialMedia])}>
            {socialMediaIcons[socialMedia]}
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -55,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: 'black',
  },
  name: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    //fontFamily: 'San Francisco',
    //color: 'black',
  },
  buttonContainer: {
    
    flexDirection: 'row',
    //flexDirection: 'column',
    marginTop: 40,
    width: '60%',
    justifyContent: 'space-between',
    
  },
});

export default ProfileCard;
