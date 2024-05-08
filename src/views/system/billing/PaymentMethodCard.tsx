// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box, { BoxProps } from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import DialogTitle from '@mui/material/DialogTitle'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

// ** Third Party Imports
import Payment from 'payment'
import Cards, { Focused } from 'react-credit-cards'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

interface DataType {
  name: string
  imgSrc: string
  imgAlt: string
  cardCvc: string
  expiryDate: string
  cardNumber: string
  cardStatus?: string
  badgeColor?: ThemeColor
}

interface SelectedCardType {
  cvc: string
  name: string
  expiry: string
  cardId: number
  cardNumber: string
  focus: Focused | undefined
}

const CreditCardWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('xl')]: {
    '& > div:first-of-type': {
      marginBottom: theme.spacing(6)
    }
  },
  [theme.breakpoints.up('xl')]: {
    alignItems: 'center',
    flexDirection: 'row',
    '& > div:first-of-type': {
      marginRight: theme.spacing(6)
    }
  }
}))

const data: DataType[] = [
  {
    cardCvc: '587',
    name: 'Tom McBride',
    expiryDate: '12/24',
    imgAlt: 'Mastercard',
    badgeColor: 'primary',
    cardStatus: 'Primary',
    cardNumber: '5577 0000 5577 9865',
    imgSrc: '/images/logos/mastercard.png'
  },
  {
    cardCvc: '681',
    imgAlt: 'Visa card',
    expiryDate: '02/24',
    name: 'Mildred Wagner',
    cardNumber: '4532 3616 2070 5678',
    imgSrc: '/images/logos/visa.png'
  }
]

const PaymentMethodCard = () => {
  // ** States
  const [name, setName] = useState<string>('')
  const [cvc, setCvc] = useState<string | number>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [focus, setFocus] = useState<Focused | undefined>()
  const [expiry, setExpiry] = useState<string | number>('')
  const [openEditCard, setOpenEditCard] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [selectedCard, setSelectedCard] = useState<SelectedCardType | null>(null)

  const handleEditCardClickOpen = (id: number) => {
    setSelectedCard({
      cardId: id,
      focus: undefined,
      name: data[id].name,
      cvc: data[id].cardCvc,
      expiry: data[id].expiryDate,
      cardNumber: data[id].cardNumber
    })
    setOpenEditCard(true)
  }

  const handleEditCardClose = () => {
    setOpenEditCard(false)
    setTimeout(() => {
      setSelectedCard(null)
    }, 200)
  }

  const handleBlur = () => setFocus(undefined)
  const handleSelectedCardBlur = () => setFocus(undefined)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'cardNumber') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }

  const handleInputChangeDialog = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'cardNumberDialog') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setSelectedCard({ ...selectedCard, cardNumber: target.value } as SelectedCardType)
    } else if (target.name === 'expiryDialog') {
      target.value = formatExpirationDate(target.value)
      setSelectedCard({ ...selectedCard, expiry: target.value } as SelectedCardType)
    } else if (target.name === 'cvcDialog') {
      target.value = formatCVC(target.value, (selectedCard as SelectedCardType).cardNumber, Payment)
      setSelectedCard({ ...selectedCard, cvc: target.value } as SelectedCardType)
    }
  }

  const handleResetForm = () => {
    setCvc('')
    setName('')
    setExpiry('')
    setCardNumber('')
  }

  return (
    <>
      <Card>
        <CardHeader title='Payment Method' />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <FormControl>
                    <RadioGroup
                      row
                      value={paymentMethod}
                      aria-label='payment method'
                      name='account-settings-billing-radio'
                      onChange={e => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel value='card' control={<Radio />} label='Credit/Debit/ATM Card' />
                      <FormControlLabel value='cod' label='COD/Cheque' control={<Radio />} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {paymentMethod === 'card' ? (
                  <>
                    <Grid item xs={12}>
                      <CreditCardWrapper>
                        <CardWrapper>
                          <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
                        </CardWrapper>
                      </CreditCardWrapper>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <TextField
                          fullWidth
                          name='cardNumber'
                          value={cardNumber}
                          autoComplete='off'
                          label='Card Number'
                          onBlur={handleBlur}
                          onChange={handleInputChange}
                          placeholder='0000 0000 0000 0000'
                          onFocus={e => setFocus(e.target.name as Focused)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name='name'
                        value={name}
                        autoComplete='off'
                        onBlur={handleBlur}
                        label='Name on Card'
                        placeholder='John Doe'
                        onChange={e => setName(e.target.value)}
                        onFocus={e => setFocus(e.target.name as Focused)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        name='expiry'
                        label='Expiry'
                        value={expiry}
                        onBlur={handleBlur}
                        placeholder='MM/YY'
                        onChange={handleInputChange}
                        inputProps={{ maxLength: '5' }}
                        onFocus={e => setFocus(e.target.name as Focused)}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        fullWidth
                        name='cvc'
                        label='CVC'
                        value={cvc}
                        autoComplete='off'
                        onBlur={handleBlur}
                        onChange={handleInputChange}
                        onFocus={e => setFocus(e.target.name as Focused)}
                        placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel control={<Switch defaultChecked />} label='Save Card for future billing?' />
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 4, fontWeight: 500 }}>My Cards</Typography>
              {data.map((item: DataType, index: number) => (
                <Box
                  key={index}
                  sx={{
                    p: 5,
                    display: 'flex',
                    borderRadius: 1,
                    flexDirection: ['column', 'row'],
                    justifyContent: ['space-between'],
                    backgroundColor: 'action.hover',
                    alignItems: ['flex-start', 'center'],
                    mb: index !== data.length - 1 ? 4 : undefined
                  }}
                >
                  <div>
                    <img height='25' alt={item.imgAlt} src={item.imgSrc} />
                    <Box sx={{ mt: 1, mb: 2.5, display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                      {item.cardStatus ? (
                        <CustomChip
                          skin='light'
                          size='small'
                          sx={{ ml: 4 }}
                          label={item.cardStatus}
                          color={item.badgeColor}
                        />
                      ) : null}
                    </Box>
                    <Typography variant='body2'>
                      **** **** **** {item.cardNumber.substring(item.cardNumber.length - 4)}
                    </Typography>
                  </div>

                  <Box sx={{ mt: [3, 0], textAlign: ['start', 'end'] }}>
                    <Button variant='outlined' sx={{ mr: 4 }} onClick={() => handleEditCardClickOpen(index)}>
                      Edit
                    </Button>
                    <Button variant='outlined' color='secondary'>
                      Delete
                    </Button>
                    <Typography variant='body2' sx={{ mt: 4 }}>
                      Card expires at {item.expiryDate}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' sx={{ mr: 4 }}>
                Save Changes
              </Button>
              <Button type='reset' variant='outlined' color='secondary' onClick={handleResetForm}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={openEditCard}
        onClose={handleEditCardClose}
        aria-labelledby='user-view-billing-edit-card'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
        aria-describedby='user-view-billing-edit-card-description'
      >
        <DialogTitle id='user-view-billing-edit-card' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          Edit Card
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            variant='body2'
            id='user-view-billing-edit-card-description'
            sx={{ textAlign: 'center', mb: 7 }}
          >
            Edit your saved card details
          </DialogContentText>
          {selectedCard !== null && (
            <form>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <CardWrapper sx={{ '& .rccs': { m: '0 auto' } }}>
                    <Cards
                      cvc={selectedCard.cvc}
                      focused={selectedCard.focus}
                      expiry={selectedCard.expiry}
                      name={selectedCard.name}
                      number={selectedCard.cardNumber}
                    />
                  </CardWrapper>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        autoComplete='off'
                        label='Card Number'
                        name='cardNumberDialog'
                        onBlur={handleSelectedCardBlur}
                        onChange={handleInputChangeDialog}
                        placeholder='0000 0000 0000 0000'
                        defaultValue={selectedCard.cardNumber}
                        onFocus={e => setSelectedCard({ ...selectedCard, focus: e.target.name as Focused })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        name='nameDialog'
                        autoComplete='off'
                        label='Name on Card'
                        placeholder='John Doe'
                        onBlur={handleSelectedCardBlur}
                        defaultValue={selectedCard.name}
                        onChange={e => setSelectedCard({ ...selectedCard, name: e.target.value })}
                        onFocus={e => setSelectedCard({ ...selectedCard, focus: e.target.name as Focused })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label='Expiry'
                        placeholder='MM/YY'
                        name='expiryDialog'
                        defaultValue={expiry}
                        onBlur={handleSelectedCardBlur}
                        inputProps={{ maxLength: '5' }}
                        onChange={handleInputChangeDialog}
                        onFocus={e => setSelectedCard({ ...selectedCard, focus: e.target.name as Focused })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-billing-edit-card-status-label'>Card Status</InputLabel>
                        <Select
                          label='Card Status'
                          id='user-view-billing-edit-card-status'
                          labelId='user-view-billing-edit-card-status-label'
                          defaultValue={
                            data[selectedCard.cardId].cardStatus ? data[selectedCard.cardId].cardStatus : ''
                          }
                        >
                          <MenuItem value='Primary'>Primary</MenuItem>
                          <MenuItem value='Expired'>Expired</MenuItem>
                          <MenuItem value='Active'>Active</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label='CVC'
                        name='cvcDialog'
                        defaultValue={cvc}
                        autoComplete='off'
                        onBlur={handleSelectedCardBlur}
                        onChange={handleInputChangeDialog}
                        onFocus={e => setSelectedCard({ ...selectedCard, focus: e.target.name as Focused })}
                        placeholder={Payment.fns.cardType(selectedCard.cardNumber) === 'amex' ? '1234' : '123'}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label='Save Card for future billing?'
                        sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 1 }} onClick={handleEditCardClose}>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleEditCardClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PaymentMethodCard
