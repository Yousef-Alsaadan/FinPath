// Explicit icon registry. Importing named icons (instead of `import * as Fa`)
// lets the bundler tree-shake react-icons down to just what we use.
import {
  FaHome,
  FaBolt,
  FaUtensils,
  FaCar,
  FaFilm,
  FaGraduationCap,
  FaHeartbeat,
  FaShoppingBag,
  FaPiggyBank,
  FaEllipsisH,
  FaTag,
  FaInbox,
  FaShieldAlt,
  FaPlane,
  FaCreditCard,
  FaStar,
} from 'react-icons/fa'

export const ICONS = {
  FaHome,
  FaBolt,
  FaUtensils,
  FaCar,
  FaFilm,
  FaGraduationCap,
  FaHeartbeat,
  FaShoppingBag,
  FaPiggyBank,
  FaEllipsisH,
  FaTag,
  FaInbox,
  FaShieldAlt,
  FaPlane,
  FaCreditCard,
  FaStar,
}

export const getIcon = (name) => ICONS[name] || FaTag
