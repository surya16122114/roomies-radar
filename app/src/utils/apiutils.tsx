export const fetchUserProfile = async (userId: string): Promise<{ fullName: string } | null> => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/${userId}`);
      const data = await response.json();
      if (response.ok && data.user) {
        const { firstName, lastName } = data.user;
        return { fullName: `${firstName} ${lastName}` };
      } else {
        console.error(`Error fetching user profile: ${data.message}`);
        return null;
      }
    } catch (error) {
      console.error("Error during user profile API call:", error);
      return null;
    }
  };
  