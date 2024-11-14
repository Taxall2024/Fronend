import { useState } from "react";
import Nav from "./Nav";
import { AnimatePresence } from "framer-motion";

const Header = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <div>
                <div onClick={() => setIsActive(!isActive)} className='button'>
                    <div className={`burger ${isActive ? "burgerActive" : ""}`}></div>
                </div>
            </div>

            {/* AnimatePresence should only wrap conditional elements */}
            <AnimatePresence>
                {isActive && <Nav />}
            </AnimatePresence>
        </>
    );
};

export default Header;