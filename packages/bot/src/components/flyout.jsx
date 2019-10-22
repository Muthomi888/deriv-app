import classNames           from 'classnames';
import React                from 'react';
import PropTypes            from 'prop-types';
import FlyoutBlockGroup     from './flyout-block-group.jsx';
import HelpBase             from '../scratch/help-content/flyout-help-base.jsx';
import { config }           from '../scratch/help-content/help-content.config';
import { connect }          from '../stores/connect';
import { translate }        from '../utils/lang/i18n';
import                           '../assets/sass/scratch/flyout.scss';

const Flyout = ({
    is_help_content,
    is_search_flyout,
    flyout_content,
    flyout_width,
    is_visible,
    search_term,
    setHelpContent,
}) => {
    const total_result = Object.keys(flyout_content).length;
    const is_empty = total_result === 0;

    return (
        <div
            className={classNames(
                'flyout', {
                    'hidden'        : !is_visible,
                    'flyout__search': is_search_flyout,
                    'flyout__help'  : is_help_content,
                    'flyout__normal': !is_help_content && !is_search_flyout,
                },
            )
            }
            style={{ width: `${flyout_width}px` }}
        >
            {
                is_search_flyout && !is_help_content && (
                    <div className='flyout__search-header'>
                        <span className='flyout__search-header-text'>{translate(`Results for "${search_term}"`)}</span>
                        <span className={classNames(
                            'flyout__search-header-text',
                            'flyout__search-header-results',
                        )}
                        >{`${total_result} ${translate('results')}`}
                        </span>
                    </div>
                )
            }
            {
                is_help_content ?
                    <HelpBase /> :
                    <div className='flyout__content'>
                        {
                            is_empty ?
                                <div className='flyout__search-empty'>
                                    <h2>{translate('No results found')}</h2>
                                </div> :
                                flyout_content.map((node, index) => {
                                    const tag_name = node.tagName.toUpperCase();

                                    switch (tag_name) {
                                        case Blockly.Xml.NODE_BLOCK: {
                                            const block_type = node.getAttribute('type');

                                            return (
                                                <FlyoutBlockGroup
                                                    key={node.getAttribute('type') + Date.now()}
                                                    id={`flyout__item-workspace--${index}`}
                                                    block_node={node}
                                                    onInfoClick={
                                                        config[block_type]
                                                    && (() => setHelpContent(node))
                                                    }
                                                />
                                            );
                                        }
                                        case Blockly.Xml.NODE_LABEL: {
                                            return (
                                                <div
                                                    key={node.getAttribute('text') + index}
                                                    className='flyout__item-label'
                                                >
                                                    {node.getAttribute('text')}
                                                </div>
                                            );
                                        }
                                        case Blockly.Xml.NODE_BUTTON: {
                                            const callback_key = node.getAttribute('callbackKey');
                                            const callback =
                                        Blockly.derivWorkspace.getButtonCallback(callback_key) || (() => { });

                                            return (
                                                <button
                                                    key={`${callback_key}${index}`}
                                                    className={
                                                        classNames(
                                                            'flyout__button',
                                                            'flyout__button-new'
                                                        )
                                                    }
                                                    onClick={(button) => {
                                                        const flyout_button = button;

                                                        // Workaround for not having a flyout workspace.
                                                        // eslint-disable-next-line no-underscore-dangle
                                                        flyout_button.targetWorkspace_ = Blockly.derivWorkspace;
                                                        // eslint-disable-next-line no-underscore-dangle
                                                        flyout_button.getTargetWorkspace =
                                                    () => flyout_button.targetWorkspace_;

                                                        callback(flyout_button);
                                                    }}
                                                >
                                                    {node.getAttribute('text')}
                                                </button>
                                            );
                                        }
                                        default:
                                            return null;
                                    }
                                })
                        }
                    </div>
            }
        </div>
    );
};

Flyout.propTypes = {
    flyout_content  : PropTypes.any,
    flyout_width    : PropTypes.number,
    is_help_content : PropTypes.bool,
    is_search_flyout: PropTypes.bool,
    is_visible      : PropTypes.bool,
    search_term     : PropTypes.string,
    setHelpContent  : PropTypes.func,
};

export default connect(({ flyout, flyout_help }) => ({
    flyout_content  : flyout.flyout_content,
    flyout_width    : flyout.flyout_width,
    is_help_content : flyout.is_help_content,
    is_visible      : flyout.is_visible,
    is_search_flyout: flyout.is_search_flyout,
    search_term     : flyout.search_term,
    setHelpContent  : flyout_help.setHelpContent,
}))(Flyout);

