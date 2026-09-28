import { Text, View } from "react-native";
import { useMembership } from "src/context/MembershipContext";

export default function ScheduleRoute() {
  const { activeMembership } = useMembership();

  console.log(
    "ACTIVE MEMBERSHIP:",
    activeMembership.organizationId,
    activeMembership.roles
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Schedule</Text>
    </View>
  );
}