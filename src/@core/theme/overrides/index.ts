// ** MUI Imports
import { Theme } from '@mui/material/styles'
import { ComponentsPropsList } from '@mui/material'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

export type OwnerStateThemeType = {
  theme: Theme
  ownerState: ComponentsPropsList[keyof ComponentsPropsList] & Record<string, unknown>
}

// ** Overrides Imports
import MuiCard from './card'
import MuiChip from './chip'
import MuiLink from './link'
import MuiList from './list'
import MuiMenu from './menu'
import MuiTabs from './tabs'
import FabButton from './fab'
import MuiInput from './input'
import MuiPaper from './paper'
import MuiTable from './table'
import MuiAlerts from './alerts'
import MuiButton from './button'
import MuiDialog from './dialog'
import MuiRating from './rating'
import MuiSelect from './select'
import MuiAvatar from './avatars'
import MuiDivider from './divider'
import MuiPopover from './popover'
import MuiTooltip from './tooltip'
import MuiBackdrop from './backdrop'
import MuiDataGrid from './dataGrid'
import MuiSnackbar from './snackbar'
import MuiSwitches from './switches'
import MuiTimeline from './timeline'
import MuiAccordion from './accordion'
import MuiPagination from './pagination'
import MuiTypography from './typography'
import MuiBreadcrumb from './breadcrumbs'
import MuiAutocomplete from './autocomplete'
import MuiToggleButton from './toggleButton'

const Overrides = (settings: Settings) => {
  const { skin, mode } = settings

  const chip = MuiChip()
  const list = MuiList()
  const tabs = MuiTabs()
  const input = MuiInput()
  const tables = MuiTable()
  const menu = MuiMenu(skin)
  const button = MuiButton()
  const rating = MuiRating()
  const cards = MuiCard(skin)
  const avatars = MuiAvatar()
  const divider = MuiDivider()
  const tooltip = MuiTooltip()
  const fabButton = FabButton()
  const alerts = MuiAlerts(mode)
  const dialog = MuiDialog(skin)
  const backdrop = MuiBackdrop()
  const dataGrid = MuiDataGrid()
  const switches = MuiSwitches()
  const timeline = MuiTimeline()
  const popover = MuiPopover(skin)
  const accordion = MuiAccordion()
  const snackbar = MuiSnackbar(skin)
  const pagination = MuiPagination()
  const breadcrumb = MuiBreadcrumb()
  const autocomplete = MuiAutocomplete(skin)

  return Object.assign(
    chip,
    list,
    menu,
    tabs,
    cards,
    input,
    alerts,
    button,
    dialog,
    rating,
    tables,
    avatars,
    divider,
    MuiLink,
    popover,
    tooltip,
    backdrop,
    dataGrid,
    MuiPaper,
    snackbar,
    switches,
    timeline,
    accordion,
    MuiSelect,
    fabButton,
    breadcrumb,
    pagination,
    autocomplete,
    MuiTypography,
    MuiToggleButton
  )
}

export default Overrides
