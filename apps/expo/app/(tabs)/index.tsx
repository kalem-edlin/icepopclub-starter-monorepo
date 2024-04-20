import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";

export default function ProfileScreen() {
    const { isLoaded, isSignedIn, user } = useUser();

	return isLoaded && isSignedIn && user && (
		<View className="w-full gap-y-3 h-full justify-center items-center">
             {user.profileImageUrl && <Image className="w-full h-28"  source={{uri: user.profileImageUrl}}/>}
            <Text>
                Name: {user.fullName}
            </Text>
            <Text>
                Email: {user.primaryEmailAddress?.emailAddress},
            </Text>
		</View>
	)
}
