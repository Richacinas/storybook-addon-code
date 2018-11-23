import React from 'react';
import addons from '@storybook/addons';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-sass.js';

import 'prismjs/themes/prism.css';

class Code extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {code: ''};
    this.channelName = `soft/code/add_${props.label}`;
    this.onSelectTab = this.onSelectTab.bind(this);
  }

  onSelectTab({code, type}) {
    const formattedCode = type && code && Prism.highlight(code, Prism.languages[type]);

    this.setState({code: formattedCode});
  }

  componentDidMount() {
    const { channel, api } = this.props;
    channel.on(this.channelName, this.onSelectTab);

    this.stopListeningOnStory = api.onStory(() => {
      this.onSelectTab('');
    });
  }

  render() {
    const { code } = this.state;
    const { type, active } = this.props;
    return active ? (
      <div>{ 
          code ? 
            <pre>
              <code>
                <div dangerouslySetInnerHTML={{__html: code}} />
              </code>
            </pre> :
            <p> No {type} code Found </p>
        }
      </div>
    ) : null;
  }

  componentWillUnmount() {
    if(this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel, api } = this.props;
    channel.removeListener(this.channelName, this.onSelectTab);
  }
}

const registerTab  = ({label, type}) => {
  addons.register(`soft/code/add_${label}`, (api) => {
    addons.addPanel(`soft/${label}/panel`, {
      title: label,
      render: ({ active }) => (
        <Code channel={addons.getChannel()} api={api} type={type} label={label} active={active} />
      )
    })
  })
}
export const setTabs = (tabs) => {
  const tabsToRender = [].concat(tabs);
  tabsToRender.forEach((t) => registerTab(t));
}