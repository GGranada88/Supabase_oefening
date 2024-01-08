import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/");
      } else {
        setUser(data.user);
      }
    };
    checkUser();
  }, [navigate]);

  const [cadeaus, setCadeaus] = useState([]);
  const [newCadeau, setNewCadeau] = useState("");
  const getCadeaus = async () => {
    const { data } = await supabase
      .from("cadeaus")
      .select()
      .order("created_at", { ascending: false });
    setCadeaus(data);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleCheck = async (id, checked) => {
    const { error } = await supabase
      .from("cadeaus")
      .update({ checked })
      .eq("id", id);
    getCadeaus();
  };

  const deleteCadeau = async (id) => {
    await supabase.from("cadeaus").delete().eq("id", id);
    getCadeaus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCadeau) {
      return;
    } else {
      await supabase.from("cadeaus").insert({
        gift: newCadeau,
      });
    }

    setNewCadeau("");
    getCadeaus();
  };

  useEffect(() => {
    getCadeaus();
  }, []);

  return (
    <div className="container">
      <div>
        <h1>Lijst met gewenste cadeaus</h1>
        <button onClick={signOut}>sign Out</button>
        <form className="form-flex" action="" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newCadeau}
            placeholder="Gewenst cadeau..."
            onChange={(e) => setNewCadeau(e.target.value)}
          />
          <button type="submit">Add cadeau</button>
        </form>
        <ul>
          {cadeaus.map(({ id, gift, checked }) => (
            <div className="flex-data">
              <li className={checked ? "checked" : ""} key={id}>
                {gift}
                <button onClick={() => toggleCheck(id, !checked)}>
                  {checked ? "uncheck" : "check"}
                </button>
                <button onClick={() => deleteCadeau(id)}>Delete</button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
