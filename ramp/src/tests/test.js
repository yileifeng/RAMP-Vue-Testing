import { mount } from '@vue/test-utils'
import GridComponent from '../components/GridComponent'

describe('GridComponent', () => {
    test('is a Vue instance', () => {
        const wrapper = mount(GridComponent);
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})