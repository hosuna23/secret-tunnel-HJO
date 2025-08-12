/** Button that attempts to use the token in context when clicked */
import { useAuth } from "./AuthContext";

export default function Tablet() {
  const { authenticate, error } = useAuth();

  async function handleAuthenticate(e) {
    e.preventDefault();
    try {
      await authenticate();
    } catch {
      // error state 
    }
  }

  return (
    <section>
      <p>
        The badger on the right presents a stone tablet. “Only those pure of
        heart may pass.” Place your palm to be judged.
      </p>
      <form onSubmit={handleAuthenticate}>
        <button type="submit">Place your palm upon the tablet.</button>
      </form>
      {error && <p role="alert" style={{ color: "crimson" }}>{error}</p>}
    </section>
  );
}
