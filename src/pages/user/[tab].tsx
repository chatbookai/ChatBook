// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Demo Components Imports
import AccountSettings from 'src/views/account/AccountSettings'

const AccountSettingsTab = ({ tab, apiPricingPlanData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } },
      { params: { tab: 'notifications' } },
      { params: { tab: 'connections' } }
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

export default AccountSettingsTab
