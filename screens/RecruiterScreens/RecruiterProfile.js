import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { theme } from "../../theme";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import {
  HomeIcon,
  ArrowRightStartOnRectangleIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";

export default function RecruiterProfile() {
  const navigation = useNavigation();
  const userId = auth.currentUser.uid;
  const [userProfile, setUserProfile] = useState(null);
  const [recruiterJobs, setRecruiterJobs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getUserInfo = async () => {
      const docRef = doc(db, "users", `${userId}`);
      const realTimeProfile = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          setLoading(false);
        }
      });
    };

    getUserInfo();

    const getRecruiterJobs = async () => {
      const docRef = doc(db, "users", `${userId}`);

      const realTimeJobUpdate = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists) {
          setRecruiterJobs(docSnap.data().jobs);
        }
      });
    };

    getRecruiterJobs();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={theme.primaryColor} size={"large"} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {userProfile ? (
            <View style={{ paddingHorizontal: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                  <HomeIcon color={theme.primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    signOut(auth).then(() => navigation.navigate("LookingFor"))
                  }
                >
                  <ArrowRightStartOnRectangleIcon color={theme.primaryColor} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginTop: 30,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: userProfile.profileImage }}
                  style={{ width: 80, height: 80, borderRadius: 500 }}
                />
                <View style={{ gap: 5 }}>
                  <Text style={{ fontSize: 18, fontWeight: 500 }}>
                    {userProfile.username}
                  </Text>
                  <Text>{userProfile.email}</Text>
                  <Text>{userProfile.recruiterRole}</Text>
                </View>
              </View>
              {/* Show Jobs By Recruiter */}

              {recruiterJobs ? (
                <View style={{ gap: 20, marginTop: 30 }}>
                  <Text style={{ fontSize: 20, fontWeight: 700 }}>
                    Your Jobs
                  </Text>
                  {recruiterJobs.map((data, index) => {
                    return (
                      <View
                        style={{
                          backgroundColor: theme.lightBackgroundColor,

                          paddingVertical: 10,
                          borderRadius: 10,
                          paddingHorizontal: 20,
                          gap: 12,
                        }}
                      >
                        <Text style={{ fontWeight: 600, fontSize: 18 }}>
                          Company: {data.companyName}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 400,
                              fontSize: 16,
                              color: theme.lightColor,
                            }}
                          >
                            {data.jobTitle}
                          </Text>
                          <Text
                            style={{
                              fontWeight: 400,
                              fontSize: 16,
                              color: theme.lightColor,
                            }}
                          >
                            {data.jobType}
                          </Text>
                        </View>

                        <Text
                          style={{
                            fontWeight: 400,
                            fontSize: 16,
                            color: theme.lightColor,
                          }}
                        >
                          Job Description: {data.jobDescription}
                        </Text>
                        <Text
                          style={{
                            fontWeight: 400,
                            fontSize: 16,
                            color: theme.lightColor,
                          }}
                        >
                          Skills: {data.requiredSkills}
                        </Text>

                        {/* <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 400,
                              fontSize: 16,
                              color: theme.lightColor,
                            }}
                          >
                            Salary: {data.salary}
                          </Text>
                          <Text
                            style={{
                              fontWeight: 400,
                              fontSize: 16,
                              color: theme.lightColor,
                            }}
                          >
                            Deadline: {data.applicationDeadline}
                          </Text>
                        </View> */}

                        {/* <Text
                          style={{
                            fontWeight: 400,
                            fontSize: 16,
                            color: theme.lightColor,
                          }}
                        >
                          Instrctions: {data.applicationIntruction}
                        </Text> */}

                        {/* <Text
                          style={{
                            fontWeight: 400,
                            fontSize: 16,
                            color: theme.lightColor,
                          }}
                        >
                          Contact: {data.contactInformation}
                        </Text> */}
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  <View
                    style={{
                      backgroundColor: theme.alertColor,
                      marginTop: 30,
                      paddingVertical: 10,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 30,
                      }}
                    >
                      <Text style={{ color: theme.alertIconColor }}>
                        You have not posted any job.
                      </Text>
                      <XCircleIcon color={theme.alertIconColor} />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("AddJob")}
                    style={{
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingVertical: 20,
                      flexDirection: "row",
                      paddingHorizontal: 30,
                      gap: 10,
                      alignItems: "center",
                      backgroundColor: "black",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "white",
                      }}
                    >
                      Post a Job
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}
