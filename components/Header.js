import { Menu } from "semantic-ui-react"
import { Link } from '../routes'

const Header = () => {
  return (
    <Menu style={{ marginTop: 10 }}>
        <Link legacyBehavior route="/">
            <a className="item">CrowdCoin</a>
        </Link>

        <Menu.Menu position="right">
            <Link legacyBehavior route="/">
                <a className="item">Campaigns</a>
            </Link>

            <Link legacyBehavior route="/campaigns/new">
                <a className="item">+</a>
            </Link>
        </Menu.Menu>
    </Menu>
  )
}

export default Header