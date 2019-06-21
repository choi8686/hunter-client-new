import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage,
  Modal,
  Alert
} from "react-native";
import { LinearGradient } from "expo";
import { Avatar, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import TopBarRightIcons from "../../components/bottomNavi/topBarRightIcons";
import { url } from "../../url";

export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props);

    this._bootstrapAsync();
  }

  state = {
    modalVisible: false,
    userId: null
  };
  static navigationOptions = ({ navigation }) => {
    return {
      title: "설정",
      headerBackground: (
        <LinearGradient
          colors={["#514A9D", "#24C6DC"]}
          start={[0.0, 0.5]}
          end={[1.0, 0.5]}
          locations={[0.0, 1.0]}
          style={{
            flex: 1,
            paddingTop: "20%"
          }}
        />
      ),
      headerTitleStyle: {
        color: "#FAFBFB"
      },
      headerRight: <TopBarRightIcons navigation={navigation} />
    };
  };

  ///화면 로딩되자마자 AsyncStorage에 있는 userId를 추출하여 state에 저장해서 계정탈퇴 할때
  _bootstrapAsync = async () => {
    if ((await AsyncStorage.getItem("userToken")) !== undefined) {
      const userToken = await AsyncStorage.getItem("userToken");
      const userTokenArr = userToken.split("-");

      //team아디
      const id = userTokenArr[userTokenArr.length - 1];
      //유저의 아이디
      const userId = userTokenArr[userTokenArr.length - 2];
      const storeId = userTokenArr[userTokenArr.length - 3];
      const districtId = userTokenArr[userTokenArr.length - 4];
      const teamname = userTokenArr[userTokenArr.length - 5];
      const comment = userTokenArr[userTokenArr.length - 6];
      const age = userTokenArr[userTokenArr.length - 7];
      const count = userTokenArr[userTokenArr.length - 8];
      const sex = userTokenArr[userTokenArr.length - 9];

      await this.setState({
        userId: userId
      });
    } else {
      Alert.alert("잠시 후 다시 시도해주세요");
    }
  };


  //모달 true, false로 구분해주는 함수 ( true, false에 따라 모달창이 생기고 사라짐)
  //진심으로 계정삭제를 할건지 한번 더 체크하기 위해, 모달을 띄워준다
  _setModalVisible = async visible => {
    await this.setState({ modalVisible: visible });
  };

  _deleteAccount = async () => {
    fetch(`${url}/users/destroy/` + this.state.userId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: this.state.userId
      })
    }).then(async res => {
      if (res.ok) {
        console.log(res._bodyInit, "res SettingScreen.js 94 lines");
        console.log("--------Delete Account success---------", res.ok);
        await AsyncStorage.removeItem("userToken");
        console.log(await AsyncStorage.getItem("userToken"), "???????????????");

        await this.props.navigation.navigate("SignUp");
      } else {
        Alert.alert("죄송합니다. 잠시 후 다시 시도해주세요.");
        console.log("--------Delete Account fail---------", res.ok);
      }
    });
  };

  _handleLogOut = async () => {
    AsyncStorage.removeItem("userToken");
    let userToken = await AsyncStorage.getItem("userToken");
    console.log(
      userToken,
      "유저토큰 없냐 개새꺄 SettingScreen.js 35 lines !!!!!!!"
    );

    this.props.navigation.navigate("SignIn");
  };

  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          backgroundColor: "#222222",
          padding: "5%"
        }}
      >
        <TouchableOpacity
          onPress={() =>
            Alert.alert("숨겨진 운세", "오늘은 100%입니다. 믿으세요!")
          }
        >
          <Image source={require("../../logo/Logo.png")} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View style={styles.buttonGroup}>
            <Button
              title="   정보수정"
              titleStyle={{ color: "ghostwhite" }}
              // type="outline"
              icon={{
                type: "font-awesome",
                name: "check-circle",
                color: "deeppink",
                marginBottom: "5%"
              }}
              onPress={() => {
                this.props.navigation.navigate("RenewProfile");
              }}
              containerViewStyle={{ width: "100%" }}
              buttonStyle={{ width: "100%", backgroundColor: "#3A4044" }}
            />
            <Button
              title="   이용약관"
              // type="outline"
              icon={{
                type: "font-awesome",
                name: "check-circle",
                color: "deeppink",
                marginBottom: "5%"
              }}
              onPress={() => this.props.navigation.navigate("Conditions")}
              containerViewStyle={{ width: "100%" }}
              buttonStyle={{ width: "100%", backgroundColor: "#3A4044" }}
            />
            <Button
              title="   로그아웃"
              // type="outline"
              icon={{
                type: "font-awesome",
                name: "check-circle",
                color: "deeppink",
                marginBottom: "5%"
              }}
              onPress={() => {
                this._setModalVisible(true);
              }}
              containerViewStyle={{ width: "100%" }}
              buttonStyle={{ width: "100%", backgroundColor: "#3A4044" }}
            />
            <Button
              title="   계정삭제"
              // type="outline"
              icon={{
                type: "font-awesome",
                name: "check-circle",
                color: "deeppink",
                marginBottom: "5%"
              }}
              onPress={() => {
                this._setModalVisible(true);
              }}
              containerViewStyle={{ width: "100%" }}
              buttonStyle={{ width: "100%", backgroundColor: "#3A4044" }}
            />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.modalStyle}>
            <View style={styles.inModalStyle}>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "bold",
                  padding: 15
                }}
              >
                {" "}
                로그아웃 하시겠습니까?{" "}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%"
                }}
              >
                <Button
                  title="YES  "
                  color="black"
                  alignItems="center"
                  onPress={this._handleLogOut}
                />
                <Button
                  title="NO   "
                  color="black"
                  alignItems="center"
                  onPress={() => {
                    this._setModalVisible(!this.state.modalVisible);
                  }}
                >
                  <Text> OK </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.modalStyle}>
            <View style={styles.inModalStyle}>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: "bold",
                  padding: 15
                }}
              >
                {" "}
                계정을 삭제하시겠습니까?{" "}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%"
                }}
              >
                <Button
                  title="YES  "
                  color="black"
                  alignItems="center"
                  onPress={this._deleteAccount}
                />
                <Button
                  title="NO   "
                  color="black"
                  alignItems="center"
                  onPress={() => {
                    this._setModalVisible(!this.state.modalVisible);
                  }}
                >
                  <Text> OK </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      // </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  avatarContainer: {
    marginTop: "5%"
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2
  },
  buttonGroup: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "space-evenly",
    height: "50%",
    width: "100%"
  },
  headerRightIcon: {
    marginRight: 15
  },
  modalStyle: {
    flex: 1,
    // flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center"
  },
  inModalStyle: {
    height: "25%",
    width: "80%",
    borderColor: "pink",
    borderWidth: 1.5,
    borderRadius: 20,
    borderStyle: "solid",
    backgroundColor: "rgba(52, 52, 52, 0.7)",
    alignItems: "center",
    justifyContent: "center"
  }
});
