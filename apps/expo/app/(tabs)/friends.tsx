import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { trpc } from "../../services/Query"

export default function TabTwoScreen() {
	const otherUsersQuery = trpc.users.getOtherUsers.useQuery()
    const addFriendMutation = trpc.users.addFriend.useMutation()

    const handleAddUser = () => {
        
    }

	return (
        <View className="h-full w-full justify-center items-center">
        {otherUsersQuery.isLoading && <ActivityIndicator />}
        {otherUsersQuery.data &&
            (otherUsersQuery.data.length === 0 ? (
                <Text>No users found</Text>
            ) : (
                otherUsersQuery.data.map((user) => {
                    return <View className="flex-row w-full justify-between">
<Text key={user.id}>{user.firstName} {user.lastName && ` ${user.lastName}`}</Text>
<TouchableOpacity onPress={handleAddUser}>
    {  
<Text>Add</Text>
    }
</TouchableOpacity>
                        </View>
                })
            ))}
        {otherUsersQuery.error && (
            <Text>Error Occured {otherUsersQuery.error.message}</Text>
        )}
    </View>
	)
}
