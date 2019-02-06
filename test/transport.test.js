let assert = require('chai').assert;

let Transport = require('../lib/core/transport.js').default


describe('TRANSPORT:', function() {
    describe('resolve Transport files:', function() {
        it('should set fragments and set valid transport files', function() {
            let transport = new Transport()

            let fragments_items = {
                "fragment-one":[
                    {
                        "from":"f-a",
                        "to":"f-b"
                    }
                ],
                "fragment-two":[
                    {
                        "from":"ft-a",
                        "to":"ft-b"
                    }
                ]
            }
            let tranport_items = [
                "fragment-one",
                "fragment-two",
                {
                    "from":"a",
                    "to":"b"
                }
            ]

            transport.setFiles(tranport_items)
            transport.setFragmentsFiles(fragments_items)

            assert.sameDeepMembers(transport.transportFiles, [
                {
                    from:"f-a",
                    to:"f-b"
                },
                {
                    from:"ft-a",
                    to:"ft-b"
                },
                {
                    from:"a",
                    to:"b"
                }
            ])
        });

        it('should set wrong fragment and throw a error', function() {
            let transport = new Transport()

            let fragments_items = {
                "fragment-one":[
                    {
                        "from":"f-a",
                        "to":"f-b"
                    }
                ]
            }
            let tranport_items = [
                "fragment-one",
                "wrong",
                {
                    "from":"a",
                    "to":"b"
                }
            ]

            transport.setFiles(tranport_items)
            transport.transportFragmentsFiles = fragments_items

            assert.throws(function(){
                transport.resolveFragments("wrong")
            },'Not found fragment: wrong')
        });
    });
});