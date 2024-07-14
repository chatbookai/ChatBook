import PPTXApp from 'src/views/pptx/pptx';
import Box from '@mui/material/Box'

const PPTXAppAPP = () => {
    
    return (
        <Box
            className='app-chat'
            sx={{
                width: '100%',
                height: '98%',
                display: 'flex',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'background.paper',
            }}
            >
            <PPTXApp />
        </Box>
    )
}

PPTXAppAPP.contentHeightFixed = true

export default PPTXAppAPP