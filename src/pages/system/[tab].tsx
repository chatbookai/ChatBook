// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Demo Components Imports
import SystemSettings from 'src/views/system/SystemSettings'

const SystemSettingsTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <SystemSettings tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'system' } },
      { params: { tab: 'user' } },
      { params: { tab: 'logs' } },
      { params: { tab: 'application' } },
      { params: { tab: 'notification' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {

  return {
    props: {
      tab: params?.tab,
      apiPricingPlanData: []
    }
  }
}

export default SystemSettingsTab
