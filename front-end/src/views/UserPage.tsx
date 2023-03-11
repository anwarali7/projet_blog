export default function UserPage({ user }: { user: any }) {
  return (
    <div id="user-page">
      {
        Object.entries(user).map(([key, value]) =>
          <p>
            {key.charAt(0).toUpperCase() + key.slice(1) + " : " + value}
          </p>
        )
      }
    </div>
  );
}