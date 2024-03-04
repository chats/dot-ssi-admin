import { Spin } from "antd"

const LoadingSpinner: React.FC = () => {
    return <>
      <Spin tip="Loading..." size="large">
        <div style={{padding: '60px', background: 'rgba(0,0,0,0.2', borderRadius: '4px'}}/>
      </Spin>
    </>

}

export default LoadingSpinner