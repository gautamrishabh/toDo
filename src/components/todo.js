import React, { useState, useEffect } from "react";
import "./styles.css";
import app from "../firebase";

import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";


import { Link } from "react-router-dom";

const auth = getAuth(app);

// get the localStorage data back

const getLocalData = () => {
  const lists = localStorage.getItem("mytodolist");
  

  if (lists) {
    return JSON.parse(lists);
  } else {
    return [];
  }
};

const Todo = () => {
  const [inputdata, setInputData] = useState("");
  const [items, setItems] = useState(getLocalData());
  const [isEditItem, setIsEditItem] = useState("");
  const [toggleButton, setToggleButton] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  

  // add the items fucnction
  const addItem = () => {
    if (!inputdata) {
      alert("plz fill the data");
    } else if (inputdata && toggleButton) {
      setItems(
        items.map((curElem) => {
          if (curElem.id === isEditItem) {
            return { ...curElem, name: inputdata };
          }
          return curElem;
        })
      );

      setInputData("");
      setIsEditItem(null);
      setToggleButton(false);
    } else {
      const myNewInputData = {
        id: new Date().getTime().toString(),
        name: inputdata,
      };
      setItems([...items, myNewInputData]);
      setInputData("");
    }
  };

  //edit the items
  const editItem = (index) => {
    const item_todo_edited = items.find((curElem) => {
      return curElem.id === index;
    });
    setInputData(item_todo_edited.name);
    setIsEditItem(index);
    setToggleButton(true);
  };

  // how to delete items section
  const deleteItem = (index) => {
    const updatedItems = items.filter((curElem) => {
      return curElem.id !== index;
    });
    setItems(updatedItems);
  };

  // remove all the elements
  const removeAll = () => {
    setItems([]);
  };

  // adding localStorage
  useEffect(() => {
    localStorage.setItem("mytodolist", JSON.stringify(items));
  }, [items]);

  

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // setLoading(false);
    });
    setLoading(false)
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [auth]);

  if (loading) {
    // Show a loading spinner or some other loading indicator
    return <div>Loading...</div>;
  }

  return (
    user?
    <>
      {/* <button onClick={() => loginWithRedirect()}>Log In</button> */}
      <div className="main-div">
        <div className="showItems">
          <button className="btn" data-sm-link-text="Remove All">
            <span onClick={() => signOut(auth)}> LOG OUT</span>
          </button>
          <div style={{color: "white"}}>{user.email}</div>
        </div>

        <div className="child-div">
          <figure>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX////u7u7t7e0AAAD5+fn19fXy8vL29vb8/PxiYmIsLCxKSkoNDQ2zs7NAQEAQEBDW1tYiIiKpqanIyMiVlZUcHBy5ubmPj481NTV9fX1ra2vn5+c8PDyHh4fZ2dlQUFBycnKdnZ1GRkbDw8MoKCgxMTHNzc15eXkfHx9bW1uioqKrC2XDAAAS40lEQVR4nO1diaKiOgxVQBQVQZR9FQSE///Al5TFpUXBcXnjEO4slJLmNF3SkuZOJg0J3LQiTmjTpg2JbdK8zbZo09qkWZskNm9y3y5g8uD5iHBEOCIcEY4IR4SXCBes53UaN1wArp8Aby9gOhFqWghiQ/NFk9YmzdqkeZsmLO68OWvTFnQBwicLmHANnWtx1qZdKLih+UUt1nRuCEKb7aL+v10AoyfM6AZwbsIXArSvMtoJ3cIuC6D70BsLYCH8qABfQTjq8O9H+HYdfrSRsBB+tIq/gvC3dPj16ertBTQ2jTCfNTRv09qkGSObQGeb38v2pQJa2Be1eGk2UtUzv1eLl2YjpaZz/X+wgIvH/8DaYkQ4IhwRjghHhH+O8O3zIauANolVwITO9sx8yKjF1qo741+0SQyz8fym0Ga7q6ZXFHCu3zbpDP+qgFbZ7zaMv1bAvSr+3dXT7yP8rfUhC+FHq/grCH9fh7+5m/jEYN6y7iXA12aLi28jDV189Gjo8ttIQ+K9bAKd7RUFXH626VlAC/s7uxifsNoYDeBXLe8R4YhwRDgiHBH+OcKf3dWf/zp9/+PX2wtg9IR/YPVEd+JfWD39/vrw30L4UQG+gnDU4d+F8OvTVXcBrcHzZwX022Nh7ZQs6Gw9t2KeL+CJXaIWNtsLukl6n5Py2wuY3H3O+L41hxtyTZ8y/cmb3149oQCgcrgWbkPconalXohwQy6X5BgiAOAQyZszwh2uScV96oofRchNRTcIVDXIgl1DGd7BD/zTJmWYx8Uvmj0FAK7V2xUreFvNKk5AAQCdC4tPIOTUXbYzKtJqKjWjIblJq5KSTJ32FMDNEkMu8U255abJJSTJmiEnpBpdDgCKb0UoujvAddib5h4uvybTJ7d4tWk+/N88APbM7SPA3E20/b5md8ENL2R2KEuEnqA6uXcidDOtBDmiihy4pMgBilpySFJUpeS2X8q7gHsowAIY7/2csLzg5jgNcxuRA05NlhNosrN3IeRUo/RzKSS0ClcxuVbxhtziX0BVYkxSCscvjSSgBbgZzMWdbCJfeC+Oa1bwJya0wv8WkiRhjZn7Uibt4vWzBXm2K32niC3rmKbLdLlMj8tl9YP/r9LgNq3+QNomdPyDodY1yqjiqoRFYBxsaeVZR+SW1qzgX7w9WqllWRsLKq8oQKHQZOUE2kWL8Oyo0VlAi4DQFcJrm0fMNN/ZLJU1v17zPL9W1mtFUXiFJ/d1mqKQdPgvv9atMDITd9HUYpdRhXyLVF8DK+B3Zrau7pHfSTkuU88Lpcg2D6DFxYusthY3ee4mB7+wdL43KceN5BuqcNtObloY8pVWx/UDbmtFP6UxYPQP8s6dMtT0p2uLhWscosJTeMmQ+5Cx5rcbyday2QMBoJHmhafzscbkox1MW4orkOttuoHeXTXU9yHcT/pRg1B8jNAOLYUP5x2MoGxhPjeimLQLaKrQuxP1jQjNngj5G4TIB+nWaG0QrsQORq1syQr0ePJi0KK2c8VbhDV7llX8EYRzFywzQu5UFC6M1t4IgXYez+sejtFyxl0gBCWLDfvAnbcQByEU/gQhjHPqLqltOzRbASagnA5FOJmmoMVNAcZE4jaiCTPOVdUsacy9nQoG3rXd/2YdQu2CNSuX+8OeUGOCgUHNiQMRTmYhryw3Ur6vlAjTRQCLADSTy4r7oTwAd4Jy4C7G0whdFQVAe8/O0QRDI4yYYMZup8KYOAzhxIXhxoIBVUMlQt0Rm70EO9m2iYWXg4V3KLEKVU6YTu/Ph1fnTMRA3j+F0JDBWPdzxymksAilAk0wJ7JtMME0MOpcmA/toj/CScnzx1UBBqE7d1VYz+yJrQxMwxAKQPZObeAlGay67h2oOTNdQGMA08McjtDXtL1pR4ALjdaNt7HQCIsrG8xGKQI3gxl/AMJpDINNkQNCLku0A2gOmMeEObD3NlBQSLibJYy47WzcULe3yXMIzYNvO0W48jywMRVdhx/9pB+3luetQin3TU3OBiKcmDArhvneCDLo27lUhJ5nbY/6SQHuyum0PR49bwPWOtQgqLGaHfusLZ5E6EdSGKdHXV9fmWWKclpaMdS0CVJowxAGwDmWTHknH/y8iJG7cm0urvVt6oGFl++JEftOhI7vhLG1VSp025WEtKnlUbbeqsCKLochBM7HGNu/Cc1jk57quttgB5fCZc38tATuuV9DfB/CKNwsYdXAH4uDKzRblcJc9UM04fWjFUr2vquVBpuNnSxozimvQA8v9xGsuZYIz4uMWbNdCmOi4aCBt9ZTr5AIxIEIB9mlISgQStsH1GO1RCm21gogdiDMUBk+zbnglVTy95ETe1h7VuLe5hB3EmkkmxUuUTOuH0JVrhB6jlRTSMudF/Uzx8G2BAChJJtdBcIB9KgsY8nuQKjCY36tUi/6/DoN4aV4CQzShM3dBQEU3VuBFmV1zt7TvkYoBjjjE4lbyii+p8sVnVVsjvDvji0CUBBCS7Vg1uxCuIZlo0y9VhKETpwCwJCjHjdk8MTCi3wtC9o1/h1vk6mLmw1hesIxmfzwPF290EV0WObjc1jLbQCwRTWhS7KJhZJ36nCp8Br1kgYICyeENSWrDZ9p6lVG7F7bcez58PqrykyVYfYJNx7uwqRL78hCuORPMDtZmMWKVyCfQue5oggXCzBlr9k6ZCI0EGGxAYASYxy6IG5NjFgYrtX2g8yVB22r2ars6U7e2xKaXiEYDTgssxDC8AIPiX2GWx50Q74hCZqiV8RDEYYxjKKhQD27pmANvQBmljJpG/O9MzOLAOdYO8+jPM+leNuJEG3gPHJw7yV/BHDinnh9GT6BkFn+LR1guI7DCAygFmHn6mmCi9hM1qolkC1t7iCEPCZZL+jd40BLMG4cw8GtdAUqdB4zn8SYF1YizYbYg6/cwlRNEtyI0u4j1GSYWRAhNU8ILj13WbziwZjUhZCefxHhBmZCqgeILsXDwH2PIteyZuB89B1fdGE5HSSPEKKpiQOpcfN4BgMLNfofYFJb6cMQWjDOhLcvBCnv3Vag4MFIJuWHtiP28lRwHyLEiQUz3D7ewfR4vBUChoNT3DEfdurQoxvIQmKZQGAeHFcSdMRFT4Q49z9GiItlaKTe7eMDbmdTlpAOCLv7IRPhEkby2w46h8mYD2kmsGCWfHkIwh46lE0nhKGAEi7ioftQb4X8KT0O1CHMxrdTxQymVv54m1msELZ7fn28Tfog9AnC2244cZgIbbBrnkDIwKLzCpWq8Fuv8MGsOSNo92lauvERFsAId7oQ6jhb1DqknrMRygRJl9XGRsjWFrT329TZBhCi+R1MH+xiXNit80cI9zVCqseFiJCyxJNOhN06PPEFEyGlWSGEFgIiGYH4YG0xCKEGrfTI6xRCDxFSbTcbrEMFqo+aa0VY9NIIF9BurBAQZgMQzvogBMufXlZsXoiQ2mt4IcJeOsTJ4m0I16yB+jMI088gVL6H8EM6fDfCXv3w70K4+E0dcudoZhcncUlo0+wOQrI+rHaxhyAcuLYYhFAhCNVq/6LFdCdCaw+rrfoONwThMKttmA4BYX5gWm3PW97l/xBhLcyL1od/M8Lf1+GI8DMIB4+lYz/83+nwVQh/ZT5cd86HXWFQwabxH9g09mtsmhdabUkwvxuh9coufbhP8zK7FNMPf4xQYduld/ZpPoeQ/f3wObv0/7s+ZCH84vrwDWv8byB8tQ5370QoSAShWR8aeCHCAbOF8VaEIX/CHWEjmL4Y4erUe7/0PkIq+7D90vkKdDgUYa99mvDIKxTCgrnn7fNK2jFb6LxCewJUNRL1QyhuyZeZBwhvvlv03tXv+d0CesqS/Q2YV/gl7Y0gk139mEbI/DJD/OkIQvq7xfOWd/3tidIWzE0MhCl/2nR6fZVUGcSf5siv+yGcki+kvqbOLhD8ueVd65DqQj4ToQ4IWV9Ig+3GZ3mrmLzO+ro2OwLC5W1qdvuF9I63yRCEe4KQGgygB9G9M0N/UZZd2kUS+d7IU5/sQ2jUlH9GBJlXzsFw+34D7tlKq4M++u1jF5pdcXs2RgMZNkMQWlAjKU8brAee4QcREp/pAZ4K/XSYlFUGakIMfPMWiFDA8obpi9FF6PUI9Ue702g+w5pAhLa2a7i/SIfE24S5LqAJnZpXzH7YQW6N8EQ7f9Jkw8wSosdQ03JepUPDrJwxeki9gtkwZI6lHWTiYiFkfUGkKSAqjEy5n9fXpL8OjYNdxEfaI4QmjQerqhiAUFyh0CE6lz5y3MMTNjiS2jDQ3EV4G9+0B8Id2m2wcFfuepdOyEC6TlcS05+GTQfiqg/lr/novvMlcV/deoVjallbGb0itHI77GZ3EJaGKtfOfeGUynNJgQX9BOT1eusQ210aRmSsftTPS/TPDSM8XzMsQuvjNX7CZfI+CtG1zbnXlAIY9I9el48wi5Itv97i4TWYcHXace6KTGwfMbTRRJ1dIyB0ZxfjseWdcHi61wlTyLTs9AIVoA+uj1aY9z5v4frEPb1w9gfbiY8Kz9udbxFX9uWqyPdaNu3jyc5CSA/X9Ro/mYqZUUJXhDUDr9hsL9MEPe0AoGNWCGfMXBek+ks8RuGt0DcQBuv4BNw37MFsocE4t156CDBxFwOjt2ArjRCh3Mb6qEm1Gh1OppApd0JrS458GOq1/KJa4pESBURw7OpESZzsOgnGZsci/v/6Eo/5742kNJ0ixjPuPO/v3Oshx93l5IxOukI39iQQhsanEQJjH+GEziKyX4oWRJBoZuSsvCU5E6SE5Jg5oEhAuChsxY38vWYSn+rHtMYDAIXkm2WGAR4cKbaORApLyk3NyBJgL5e2k1aHjqy4ICef5sMj8ODBhGJzUtY06WkMgzP6HM8B4h7PPXnL5uDTjbTWJpQi82CAnb4CbdwnRd8eLSsOi8g+lIkrqkmJx+I8a3taU9zX6y3hDitVI+AYCB4h5Mh0hwfujlsSNaKi43aLx6kiUyNLFSFIZKzoMN4sl3h2bt2Wryvb5TKOJceGqgdZc2hwy+0W2J25kVvyZwmpHqCLQxJUAZoo1CCnGtrezguswVTR9TNKXTnhWYgwdKAP7lSRheARwrkKSsRjhRjmYxPG5FrBBX+DVsr6IJIAUhx8PF8JOT3PSjFmBgl+4XkoLeAjwQMyELWO/LGKw/Yif1VxRKroH06O+DQ5c8lsrWZyaUINkuON1rIOpJEC8w2oWsKTf0YSzJkIbhFSEVqnGYieO44jkQgr9QV3UeSjVho2WNEHE0A6ToGnMKoQKOEKbhzH9g8YwWa2cHcA0a6Z1UFbHMK8uhyAFtm2T4LeyInqVkEFBDeDRmLaIAc54rGq+IeEOdZFKQeNwIMjtM4wGA8e74VCq0g55Kri7uyCaZtRDEAKjRxEznMUmxz6wlPAmBOlFefzqYqHlc2K/JqZ39yTwD6miWfA8fwyCC20Uqi76k0bYEZNfeMpYLMsZTy2/nSEVjxFvUvqABlaWV8YDSPZqVDBFxHpZlygJoks4xkMIncdTAdzZoFLDpxzbn3KQcZT5xoJp3QRJaOs7hKojyYKjVhJAbxVIkdZHvaEOdbFoaoKV5w8OsvdtXoiJIhuoGLMKjXJdllCrib81XWEGEHkAlClQYJKVaGgEox4xZ1/g4I4hyrD8FeQD7jhDLhTK+6qmsF9toNnLiMEjSjgm3giv41SJcO7gcth3IZBEQcYz6sPjPM2rpko1NEg6Bg4kCsgooLsUDy0Tcx5JUAVFG3axEhzz+fL8Y5k6/ptSFCHrps1ccZUd9bI8QxCOkDROYgfI1zdZWAOaBhE+Hlr1DMEaAIHXv6+J1GsYnzdiwwJi4aKO8d9Pfblg9AjjCrsWUAr2rcR/p+ie7IQPl/FPQV4ewFfRzj9ZAHd8yH3D0RoPW/iiG2+NoDq9BxAdUrt9bDefEUB8+EFtLD/0QitbUcYLgDd1b7+2x9GhCPCEeGI8P0I780WTwgwbLZ4YwFnhKz4pux43jW9IoDq2wugIrQS+jGrjdFOxtXTnwvw9dXTR6v4Kwh/a334byL8qABfQfhbOvwfz4cvKuD6pAwV35RKGpzt2wW0sH/39x9ePG/a7q+uLUaEI8IR4YhwRPjnCL8yH7ZJrAImdLZn5sMuD9ra/5T66HH3t9edf+8d49fjfamATi/o6wbANIzrNK6fYfy1Ahg94cfWFv8mwo8K8BWE417bSwX4CsLf1+Hfj/CyAIZV8WP7NIwy3mS1sQpgSPdyq+3ieaPZX7W8R4QjwhHhiHBE+OcImd4mzRr0bc4g7y+gK0Jr/dGj3SA4f/Q47yP0erNnttcWcJn0fzGq3lgAoyeMa/wfQPj3r54eIfxoFX8F4ajDlwrwFYS/NZZ+fbp6ewHn6f+eIwfL32Pom18qoIX9t9ql3P0Cxn2aEeGIcEQ4IhwRDkP4s98tGLX4A2uLywI+hvAJb5OXFPAfuoTVNLIbdAkAAAAASUVORK5CYII="
              alt="todologo"
            />
            <figcaption>Add Your List Here ✌</figcaption>
          </figure>
          <div className="addItems">
            <input
              type="text"
              placeholder="✍ Add Item"
              className="form-control"
              value={inputdata}
              onChange={(event) => setInputData(event.target.value)}
            />
            {toggleButton ? (
              <i className="far fa-edit add-btn" onClick={addItem}></i>
            ) : (
              <i className="fa fa-plus add-btn" onClick={addItem}></i>
            )}
          </div>
          {/* show our items  */}
          <div className="showItems">
            {items.map((curElem) => {
              return (
                <div className="eachItem" key={curElem.id}>
                  <h3>{curElem.name}</h3>
                  <div className="todo-btn">
                    <i
                      className="far fa-edit add-btn"
                      onClick={() => editItem(curElem.id)}
                    ></i>
                    <i
                      className="far fa-trash-alt add-btn"
                      onClick={() => deleteItem(curElem.id)}
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>

          {/* rmeove all button  */}
          <div className="showItems">
            <button
              className="btn effect04"
              data-sm-link-text="Remove All"
              onClick={removeAll}
            >
              <span> CHECK LIST</span>
            </button>
          </div>
        </div>
      </div>
    </> : <>
    <h1>Please login first <Link to="/login" >here</Link></h1>
    </>
  );
};

export default Todo;
