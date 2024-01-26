// @ts-ignore

export default async function handler(req, res) {
    try {
      if (req.method === 'POST') {
        // 从请求主体中获取数据
        const { Timestamp } = req.body;
  
        console.log("Timestamp", Timestamp);
  
        res.status(200).json({ status: 'ok', msg: 'upload success' });
      } else {
        res.status(405).json({ status: 'error', msg: 'Method Not Allowed' });
      }
    } 
    catch (error) {
      console.error('Error in API handler:', error);
      res.status(500).json({ status: 'error', msg: 'Internal Server Error' });
    }
  }
