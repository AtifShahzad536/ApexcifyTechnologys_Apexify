import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div
            className={`card ${className}`}
            initial="rest"
            whileHover={hover ? "hover" : "rest"}
            animate="rest"
            variants={{
                rest: { scale: 1 },
                hover: { scale: 1.02, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }
            }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
